const ShareDB = require("../config/sharedbConfig");
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;
const document = ShareDB.document;
let active_connections = [];

/**
 * 
 * @param {*} id id of the client
 * @param {*} res Response object
 * 
 * Attempts to connect to the document. If the document already exists, it will publish OPs through the event stream.
 * 
 */
const connectToDocument = (id, res) => {
  document.fetch(() => {
    // Add client ID to active connections
    if (!addNewConnection(id, res)) return;
    // If document doesn't exist, create it
    if (document.type === null) 
      document.create([{ insert: "" }], "rich-text");
    // Set appropriate headers
    res.set("X-Accel-Buffering", "no"); // Disable nginx buffering
    res.set("Content-Type", "text/event-stream"); 
    res.write(
      "data: " + JSON.stringify({ content: document.data.ops }) + "\n\n"
    ); // Write initial OPs to the stream

    document.on("op", (op, source) => {
      // If the incoming op is from the client, ignore it
      if (source !== id) res.write("data: " + JSON.stringify([op]) + "\n\n");
    });
  });
};

/**
 *
 * @param {*} id id of the client
 * @param {Response} res response object
 * @returns nothing
 *
 * If the client is not already connected, add them to the active_connections array.
 * If the client is already connected but they connect again, return a 400 HTTP error.
 * If the client disconnects, remove them from the active_connections array and end the text stream.
 *
 */
const addNewConnection = (id, res) => {
  if (active_connections.includes(id)) {
    res.sendStatus(400);
    return false;
  } else {
    res.on("close", () => {
      active_connections = active_connections.filter((con) => con !== id);
      res.end();
    });
    active_connections.push(id);
  }
  return true;
};

/**
 * 
 * @param {*} id id of the client
 * @param {*} ops array of operations
 * @param {*} res Response object
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
 * @param {*} id id of the client
 * @param {*} res Response object
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

module.exports = { connectToDocument, getDocumentHTML, postOps };
