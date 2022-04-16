const ShareDB = require("../config/sharedbConfig");
const { mongoDBClient } = require("../config/mongoConfig");
const generateRandomID = require("../utils/idGenerator");
const ActiveDocumentPresence = require("./activeDocuments");
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
const activeDocumentPresence = new ActiveDocumentPresence();

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
const connectToDocument = (docId, uId, res, email) => {
  // Establish a new ShareDB connection
  const connection = ShareDB.sharedb_connection;
  const document = connection.get("documents", docId);
  // Map the connection to the client ID
  document.fetch(() => {
    if (document.type === null) {
      //throw error if null
      res.status(400).send({ error: true, message: "Document Not Found" });
      return;
    }

    // Add client ID to active connections
    if (!activeDocumentPresence.addNewConnection(docId, uId)) {
      res
        .status(400)
        .send({ error: true, message: "Active user with this Id" });
      return;
    }

    setUpConnectedDocumentResponse(res, {
      docId,
      uId,
      ops: document.data.ops,
      version: document.version,
      email: email,
    });

    activeDocumentPresence.setupPresence(docId, uId, res, email);

    document.on("op", (op, source) => {
      // If the incoming op is from the client, ignore it
      if (source !== uId) {
        res.write("data: " + JSON.stringify({ op }) + "\n\n");
      } else res.write("data: " + JSON.stringify({ ack: op }) + "\n\n");
    });
    console.log("Connected to document");
  });
};

const setUpConnectedDocumentResponse = (res, data) => {
  res.on("close", () => {
    activeDocumentPresence.removeConnection(data.docId, data.uId, data.email);
    res.end();
  });
  // Set appropriate headers
  res.set("X-Accel-Buffering", "no"); // Disable nginx buffering
  res.set("Content-Type", "text/event-stream");
  res.write(
    "data: " +
      JSON.stringify({ content: data.ops, version: data.version }) +
      "\n\n"
  ); // Write initial OPs to the stream
};

const submitPresenceRange = (docId, uId, range, res) => {
  activeDocumentPresence.submitPresenceRange(docId, uId, range);
};

/**
 * @param {string} docId - Document ID
 * @param {string} uId - Client ID
 * @param {Array} ops - array of operations
 * @param {Response} res - Response object
 *
 * Goes through the ops array and submits them to the document.
 */
const postOp = (docId, uId, data, res) => {
  const { op, version } = data;
  const document = ShareDB.sharedb_connection.get("documents", docId);
  document.fetch(() => {
    console.log(
      `Submitting op ${JSON.stringify(
        op
      )} to ${uId} with version ${version}. Document version is ${
        document.version
      }`
    );
    if (version != document.version) {
      res.status(400).send({ status: "retry" });
    } else {
      document.submitOp(op, { source: uId });
      res.status(200).send({ status: "ok" });
    }
  });
};

/**
 * @param {string} docId - Document ID
 * @param {Response} res - Response object
 *
 * Returns the document as HTML using the QuillDeltaToHtmlConverter.
 */
const getDocumentHTML = (docId, uId, res) => {
  if (!activeDocumentPresence.activeDocuments[docId][uId]) {
    res.status(400).send({
      error: true,
      message: "Can't get document html if not an active client",
    });
    return;
  }

  const document = ShareDB.sharedb_connection.get("documents", docId);
  document.fetch(() => {
    if (document.type === null) {
      res.status(400).send({
        error: true,
        message: "Document not found while trying to return html for it",
      });
      return;
    }
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
      res
        .status(400)
        .send({ error: true, message: "Could not create document" });
    }
  });
};
/**
 * @param {string} id - id of the document to be deleted
 *
 * Tombstones the document with the given id
 */
const deleteDocument = (id, res) => {
  const connection = ShareDB.sharedb_server.connect();
  const doc = connection.get("documents", id);
  doc.fetch(() => {
    if (doc.type) {
      doc.del();
      res.send("success");
    } else
      res
        .status(404)
        .send({ error: true, message: "Error while deleting document" });
  });
};

/**
 * Sends a query for the 10 most recently modified documents that have a _type field (AKA non-deleted documents),
 * in descending order. Each document is one to one related to a record in the 'names'collection, so we have to left outer join them.
 * The lookup operator performs the left outer join, the project operator is specifying we only want the _id and name fields
 */
const getDocuments = async (res) => {
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
    res.status(400).send({
      error: true,
      message: "Error while getting ten most recent documents",
    });
    return;
  }
};

module.exports = {
  connectToDocument,
  getDocumentHTML,
  postOp,
  submitPresenceRange,
  createDocument,
  deleteDocument,
  getDocuments,
};
