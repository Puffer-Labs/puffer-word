const ShareDB = require("../config/sharedbConfig");
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;
// const document = ShareDB.document;

// This array keeps track of the active connections
// to make sure we don't have multiple connections from the same client
// NOTICE: Going to use connectionIds dictionary in the future instead.
let active_connections = [];

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
    const presence = doc.connection.getDocPresence("documents", "default");
    connectionIds[id] = connection;

    presence.subscribe(function (err) {
      if (err) console.error(err);
    });

    // Setup LocalPresence
    presence.create(id);

    presence.on("receive", (id, range) => {
      res.write(
        `data: ${JSON.stringify({
          cursor: {
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
  const presence = connectionIds[id].getDocPresence("documents", "default");
  /**
   * A presence has a Set of local presences. Each local presence is
   * identified by a unique ID, which is the client's ID.
   * Here, we get the local presence for the client and then update its range.
   * This will then notify all other clients of this client's new cursor position.
   */
  presence.localPresences[id].submit(range, (err) => {
    if (err) console.error(err);
    else console.log("Submitted!");
  });
};

/**
 * @deprecated - Use connectionIds instead
 * @param {string} id - id of the client
 * @param {Response} res - response object
 *
 * If the client is not already connected, add them to the active_connections array.
 * If the client is already connected but they connect again, return a 400 HTTP error.
 * If the client disconnects, remove them from the active_connections array and end the event stream.
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
