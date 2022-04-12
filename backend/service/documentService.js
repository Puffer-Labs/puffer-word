const ShareDB = require("../config/sharedbConfig");
const mongoDBClient = require("../config/mongoConfig");
const generateRandomID = require("../utils/idGenerator");
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;
// const document = ShareDB.document;

//TODO:
// Check global structures after disconnects
// Fix initial connection cursor placement

// This table keeps track of the active connections made to it, where each document name, as a key,
// has a table of id|connection key-value pairs as its value.
// ex for one active document, activeDocuments["default"]
// { "default": { "connection1": connectionObj, "connection2": connectionObj } }
let activeDocuments = {};

/**
 * Each client should have their own connection to a specific document.
 * We are using this dictionary to map each client's ID to their connection.
 */
const connectionIds = {};

/**
 *
 * @param {string} id - id of the client
 * @param {Response} res - Response object
 *
 * Attempts to connect to the document. If the document already exists, it will publish OPs through the event stream.
 *
 */
const connectToDocument = (docId, uId, res) => {
  // Establish a new ShareDB connection
  const connection = ShareDB.sharedb_connection;
  const document = connection.get("documents", docId);
  // Map the connection to the client ID
  document.fetch(() => {
    if (document.type === null)
      //throw error if null
      throw new Error("Document does not exist");

    // Add client ID to active connections
    if (!addNewConnection(docId, uId, res)) return;

    // Set appropriate headers
    res.set("X-Accel-Buffering", "no"); // Disable nginx buffering
    res.set("Content-Type", "text/event-stream");
    res.write(
      "data: " + JSON.stringify({ content: document.data.ops }) + "\n\n"
    ); // Write initial OPs to the stream

    setupPresence(docId, uId, res);

    document.on("op", (op, source) => {
      // If the incoming op is from the client, ignore it
      if (source !== uId) res.write("data: " + JSON.stringify([op]) + "\n\n");
    });
    console.log("Connected to document");
  });
};

/**
 *
 * @param {Doc} document - Document instance
 * @param {string} docId - Document ID
 * @param {string} uId - Client ID
 * Creates a LocalPresence for the client.
 */
const setupPresence = (docId, uId, res) => {
  // Setup presence
  const connection = ShareDB.sharedb_server.connect();
  const doc = connection.get("documents", docId);
  doc.fetch(() => {
    const presence = connection.getDocPresence("documents", docId);
    activeDocuments[docId][uId] = connection;

    presence.subscribe(function (err) {
      if (err) console.error(err);
    });

    // Setup LocalPresence
    presence.create(uId);

    // Emit initial cursor position for other clients
    presence.localPresences[uId].submit({ index: 0, length: 0 }, (err) => {
      if (err) console.error(err);
      else console.log("Initial presence submission received");
    });

    for (const key in activeDocuments[docId]) {
      if (key !== uId) {
        const remotePresence = activeDocuments[docId][key].getDocPresence(
          "documents",
          docId
        );
        presence.remotePresences[key] =
          remotePresence.localPresences[key].value;
      }
    }

    //For each remote presence key, write their value to client
    Object.keys(presence.remotePresences).forEach((key) => {
      if (presence.remotePresences[key]) {
        res.write(
          "data: " +
            JSON.stringify({
              cursor: {
                connClosed: false,
                id: key,
                range: presence.remotePresences[key].value,
              },
            }) +
            "\n\n"
        );
      }
    });

    presence.on("receive", (id, range) => {
      let connClosed = false;
      if (!range) connClosed = true;

      console.log("Range at `receive`", range);
      res.write(
        `data: ${JSON.stringify({
          cursor: {
            connClosed,
            id: id,
            range: range,
          },
        })}\n\n`
      );
    });
  });
};

/**
 * @param {string} docId - Document ID
 * @param {string} uId - Client ID
 * @param {Range} range - Position of the cursor and its selection
 * Updates the cursor position for the client.
 */
const submitPresenceRange = (docId, uId, range) => {
  const connection = activeDocuments[docId][uId];
  const doc = connection.get("documents", docId);
  doc.fetch(() => {
    const presence = connection.getDocPresence("documents", docId);
    /**
     * A presence has a Set of local presences. Each local presence is
     * identified by a unique ID, which is the client's ID.
     * Here, we get the local presence for the client and then update its range.
     * This will then notify all other clients of this client's new cursor position.
     */
    console.log("Range before callback", range);
    presence.localPresences[uId].submit(range, (err) => {
      if (err) console.error(err);
      else console.log("Range at `submit`", range);
    });
  });
};

/**
 * @param {string} docId - Document ID
 * @param {string} uId - Client ID
 * @param {Response} res - response object
 *
 * If the client is not already connected, add them to the active_connections array.
 * If the client is already connected but they connect again, return a 400 HTTP error.
 * If the client disconnects, remove them from the active_connections array and end the event stream.
 *
 */
const addNewConnection = (docId, uId, res) => {
  //If this document is currently active && a client with this id is already connected, do not accept connection
  if (
    activeDocuments[docId] !== undefined &&
    activeDocuments[docId][uId] !== undefined
  ) {
    res.sendStatus(400);
    return false;
  } else {
    //if document is not active, create key for it
    if (activeDocuments[docId] === undefined) activeDocuments[docId] = {};
    res.on("close", () => {
      const presence = activeDocuments[docId][uId].getDocPresence(
        "documents",
        docId
      );
      presence.destroy();
      delete activeDocuments[docId][uId];
      //if active document has no more connections, delete it
      if (Object.keys(activeDocuments[docId]).length === 0)
        delete activeDocuments[docId];
      res.end();
    });
  }
  return true;
};

/**
 * @param {string} docId - Document ID
 * @param {string} uId - Client ID
 * @param {Array} ops - array of operations
 * @param {Response} res - Response object
 *
 * Goes through the ops array and submits them to the document.
 */
const postOps = (docId, uId, ops, res) => {
  const document = ShareDB.sharedb_connection.get("documents", docId);
  document.fetch(() => {
    ops.map((op) => document.submitOp(op, { source: uId }));
    res.json({ success: true });
  });
};

/**
 * @param {string} docId - Document ID
 * @param {Response} res - Response object
 *
 * Returns the document as HTML using the QuillDeltaToHtmlConverter.
 */
const getDocumentHTML = (docId, res) => {
  const document = connection.get("documents", docId);
  document.fetch(() => {
    if (document.type === null) throw new Error("Document does not exist");
    //try to grab existing document
    const parser = new QuillDeltaToHtmlConverter(document.data.ops, {});
    res.send(parser.convert());
  });
};

/**
 *  * @param {string} name - name of the document
 *  * @param {Response} res - Response object
 *
 * Keeps generating a new Id as long as it is not already in use, before creating a new document.
 * Creates a one to one mapping with the name in the name collection
 * Returns the new document ID.
 */
const createDocument = (name, res) => {
  const connection = ShareDB.sharedb_server.connect();
  const id = generateRandomID();
  const doc = connection.get("documents", id);
  doc.fetch(async () => {
    if (doc.type === null) {
      doc.create([{ insert: "" }], "rich-text", () => {
        res.send({ docid: id });
      });
      //insert name into name collection with one to one id
      await mongoDBClient
        .db("test")
        .collection("names")
        .insertOne({ _id: id, name: name });
    } else {
      throw new Error("Document already exists");
    }
  });
};
/**
 * @param {string} id - id of the document to be deleted
 *
 * Tombstones the document with the given id
 */
const deleteDocument = (id) => {
  const connection = ShareDB.sharedb_server.connect();
  const doc = connection.get("documents", id);
  doc.fetch(() => {
    if (doc.type) doc.del();
    else console.log("Document does not exist");
  });
};

/**
 * Sends a query for the 10 most recently modified documents that have a _type field (AKA non-deleted documents),
 * in descending order. Each document is one to one related to a record in the 'names'collection, so we have to left outer join them.
 * The lookup operator performs the left outer join, the project operator is specifying we only want the _id and name fields
 */
const getDocuments = async () => {
  try {
    let docs = await mongoDBClient
      .db("test")
      .collection("documents")
      .aggregate([
        {
          $lookup: {
            from: "names",
            localField: "_id",
            foreignField: "_id",
            as: "name",
          },
        },
        { $match: { _type: { $exists: true, $ne: null } } },
        { $limit: 10 },
        { $sort: { "_m.mtime": -1 } },
        {
          $replaceWith: {
            id: "$_id",
            name: { $first: "$name.name" },
          },
        },
      ])
      .toArray();
    return docs;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  connectToDocument,
  getDocumentHTML,
  postOps,
  submitPresenceRange,
  createDocument,
  deleteDocument,
  getDocuments,
};
