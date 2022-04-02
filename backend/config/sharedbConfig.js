const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);
const sharedb_server = new ShareDB();
const sharedb_connection = sharedb_server.connect();
const document = sharedb_connection.get("documents", "default");

module.exports = { sharedb_server, sharedb_connection, document };