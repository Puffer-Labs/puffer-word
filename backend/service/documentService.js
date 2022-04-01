const ShareDB = require("../config/sharedbConfig");
const document = ShareDB.document;

const getDocument = (id, res) => {
  document.fetch(() => {
    //try to grab existing document
    if (document.type === null) {
      document.create(
        [
          { insert: "Gandalf", attributes: { bold: true } },
          { insert: " the " },
          { insert: "Grey", attributes: { color: "#ccc" } },
        ],
        "rich-text",
        () => {
          res.set("Content-Type", "text/event-stream"); //send init message
          res.write(
            "data: " + JSON.stringify({ content: document.data.ops }) + "\n\n"
          );
        }
      );
      return;
    }
    res.set("Content-Type", "text/event-stream"); //if document exists, send existing ops
    res.write(
      "data: " + JSON.stringify({ content: document.data.ops }) + "\n\n"
    );
  });
  document.on("op", (op, source) => {
    //have the client listen for changes
    res.write("data: " + JSON.stringify(op) + "\n\n");
  });
};

const getDocumentData = (id, res) => {
  document.fetch(() => {
    document.submitOp([{ retain: 1 }, { insert: "a" }], () => {
      res.json(document.data);
    });
  });
};

//get document as html
const getDocumentHTML = (id, res) => {
  document.fetch(() => {
    //try to grab existing document
    const delta_contents = JSON.stringify(document.data);
    res.render("index", { delta: delta_contents });
  });
};

module.exports = { getDocument, getDocumentData, getDocumentHTML };
