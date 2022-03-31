const ShareDB = require("../config/sharedbConfig");

const getDocument = (id, res) => {
  ShareDB.document.fetch(() => { //try to grab existing document
    if (document.type === null) {
      document.create([{ insert: "" }], "rich-text", () => {
        res.set("Content-Type", "text/event-stream"); //send init message
        res.write("data: " + JSON.stringify(document.data) + "\n\n");
      });
      return;
    }
    res.set("Content-Type", "text/event-stream"); //if document exists, send existing ops
    res.write("data: " + JSON.stringify(document.data) + "\n\n");
  });
  document.on("op", (op, source) => { //have the client listen for changes
    res.write("data: " + JSON.stringify(op) + "\n\n");
  });
};

const getDocumentData = (id, res) => {
  const document = ShareDB.sharedb_connection.get("documents", "default");
  document.fetch(() => {
    document.submitOp([{ retain: 1 }, { insert: "a" }], () => {
      res.json(document.data);
    });
  });
};

module.exports = { getDocument, getDocumentData };
