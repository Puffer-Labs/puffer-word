const ShareDB = require("sharedb");
const beforeCreate  = require("../middleware/beforeShareDBCreate");
const db = require('sharedb-mongo')('mongodb://127.0.0.1:27017/test');
ShareDB.types.register(require("rich-text").type);
const sharedb_server = new ShareDB({
	db: db,
	presence: true,
	doNotForwardSendPresenceErrorsToClient: true,
});

db.use('beforeCreate', beforeCreate);
const sharedb_connection = sharedb_server.connect();
const document = sharedb_connection.get("documents", "default");
document.submitSource = true;

module.exports = { sharedb_server, sharedb_connection, document };
