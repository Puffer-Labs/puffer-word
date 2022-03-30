const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);
const sharedb_server = new ShareDB({
  //use mongodb driver
  db: require("sharedb-mongo")("mongodb://localhost:27017/sharedb"),
});
//use middleware for reply
sharedb_server.use("reply", (context, next) => {
  console.log(context.reply);
});

const sharedb_connection = sharedb_server.connect();

const express = require("express");
const api = express();
const port = 8000;
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

const api_instance = api.listen(port, () => {
  console.log(`API running on port ${port}`);
});

module.exports = {
  sharedb_connection,
  sharedb_server,
};
