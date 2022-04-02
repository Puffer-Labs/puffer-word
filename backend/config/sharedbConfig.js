const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);
const sharedb_server = new ShareDB();
const sharedb_connection = sharedb_server.connect();

module.exports = { sharedb_server, sharedb_connection };