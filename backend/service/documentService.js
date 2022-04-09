const ShareDB = require("../config/sharedbConfig");
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;
// const document = ShareDB.document;

// This table keeps track of the active connections made to it, where each document, as a key,
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
const connectToDocument = (id, res) => {
  // Establish a new ShareDB connection
  const connection = ShareDB.sharedb_connection;
  const document = connection.get("documents", "default");

  // Map the connection to the client ID
  document.fetch(() => {
    // Add client ID to active connections
    if (!addNewConnection(id, res)) return;
    // If document doesn't exist, create it
    if (document.type === null) document.create([{ insert: "" }], "rich-text");

    // Set appropriate headers
    res.set("X-Accel-Buffering", "no"); // Disable nginx buffering
    res.set("Content-Type", "text/event-stream");
    res.write(
      "data: " + JSON.stringify({ content: document.data.ops }) + "\n\n"
    ); // Write initial OPs to the stream

    setupPresence(id, res);

    document.on("op", (op, source) => {
      // If the incoming op is from the client, ignore it
      if (source !== id) res.write("data: " + JSON.stringify([op]) + "\n\n");
    });
    console.log("Connected to document");
  });
};

/**
 *
 * @param {Doc} document - Document instance
 * @param {string} id - Client ID
 * Creates a LocalPresence for the client.
 */
const setupPresence = (id, res) => {
  // Setup presence
  const connection = ShareDB.sharedb_server.connect();
  const doc = connection.get("documents", "default");
  doc.fetch(() => {
    const presence = connection.getDocPresence("documents", "default");
    activeDocuments["default"][id] = connection;

    presence.subscribe(function (err) {
      if (err) console.error(err);
    });

    // Setup LocalPresence
    presence.create(id);

    for (const key in activeDocuments["default"]) {
      if (key !== id) {
        const remotePresence = activeDocuments["default"][key].getDocPresence(
          "documents",
          "default"
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
 *
 * @param {string} id - Client ID
 * @param {Range} range - Position of the cursor and its selection
 * Updates the cursor position for the client.
 */
const submitPresenceRange = (id, range) => {
  const connection = activeDocuments["default"][id];
  const doc = connection.get("documents", "default");
  doc.fetch(() => {
    const presence = connection.getDocPresence("documents", "default");
    /**
     * A presence has a Set of local presences. Each local presence is
     * identified by a unique ID, which is the client's ID.
     * Here, we get the local presence for the client and then update its range.
     * This will then notify all other clients of this client's new cursor position.
     */
    console.log("Range before callback", range);
    presence.localPresences[id].submit(range, (err) => {
      if (err) console.error(err);
      else console.log("Range at `submit`", range);
    });
  });
};

/**
 * @param {string} id - id of the client
 * @param {Response} res - response object
 *
 * If the client is not already connected, add them to the active_connections array.
 * If the client is already connected but they connect again, return a 400 HTTP error.
 * If the client disconnects, remove them from the active_connections array and end the event stream.
 *
 */
const addNewConnection = (id, res) => {
  //If this document is currently active && a client with this id is already connected, do not accept connection
  if (
    activeDocuments["default"] !== undefined &&
    activeDocuments["default"][id] !== undefined
  ) {
    res.sendStatus(400);
    return false;
  } else {
    //if document is not active, create key for it
    if (activeDocuments["default"] === undefined)
      activeDocuments["default"] = {};
    res.on("close", () => {
      const presence = activeDocuments["default"][id].getDocPresence(
        "documents",
        "default"
      );
      presence.destroy();
      delete activeDocuments["default"][id];
      //if active document has no more connections, delete it
      if (Object.keys(activeDocuments["default"]).length === 0)
        delete activeDocuments["default"];
      res.end();
    });
  }
  return true;
};

/**
 *
 * @param {string} id - id of the client
 * @param {Array} ops - array of operations
 * @param {Response} res - Response object
 *
 * Goes through the ops array and submits them to the document.
 */
const postOps = (id, ops, res) => {
  const document = ShareDB.sharedb_connection.get("documents", "default");
  document.fetch(() => {
    ops.map((op) => document.submitOp(op, { source: id }));
    res.json({ success: true });
  });
};

/**
 *
 * @param {string} id - id of the client
 * @param {Response} res - Response object
 *
 * Returns the document as HTML using the QuillDeltaToHtmlConverter.
 */
const getDocumentHTML = (id, res) => {
  document.fetch(() => {
    //try to grab existing document
    const parser = new QuillDeltaToHtmlConverter(document.data.ops, {});
    res.send(parser.convert());
  });
};

module.exports = {
  connectToDocument,
  getDocumentHTML,
  postOps,
  submitPresenceRange,
};
