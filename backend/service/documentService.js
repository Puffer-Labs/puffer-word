const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);
const sharedb_server = new ShareDB();
const sharedb_connection = sharedb_server.connect();

const getDocument = (id, res) => {
  const document = sharedb_connection.get("documents", id);
  document.fetch(() => {
    if (document.type === null)
      document.create([{ insert: "" }], "rich-text", () => {
        res.set("Content-Type", "text/event-stream");
        //write content of document to stream
        res.write("data: " + JSON.stringify(data) + "\n\n");
      });
  });
  // return document; //fart.
};

module.exports = { getDocument };
