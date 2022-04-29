// const ShareDB = require("sharedb");
// const redisClient = require("./redisConfig");
// const redisPubsub = require("sharedb-redis-pubsub")({ client: redisClient });
// const db = require("sharedb-mongo")("mongodb://127.0.0.1:27017/test");
// ShareDB.types.register(require("rich-text").type);

// const sharedb_server = new ShareDB({
//   db: db,
//   presence: true,
//   doNotForwardSendPresenceErrorsToClient: true,
//   pubsub: redisPubsub,
// });

// const sharedb_connection = sharedb_server.connect();
// const document = sharedb_connection.get("documents", "default");
// document.submitSource = true;

// module.exports = { sharedb_server, sharedb_connection, document };

const { redisClient, initQueue } = require("./redisConfig");
const redisPubsub = require("sharedb-redis-pubsub");
const db = require("sharedb-mongo")("mongodb://127.0.0.1:27017/test");
const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);

let shareDB;
let connection;

const getShareDB = () => {
  if (!shareDB) {
    initQueue();
    const options = {
      db: db,
    };
    options.pubsub = redisPubsub({ client: redisClient });
    shareDB = new ShareDB(options);
  }
  return shareDB;
};

const getConnection = () => {
  if (!connection) {
    connection = getShareDB().connect();
  }
  return connection;
};

module.exports = {
  getShareDB,
  getConnection,
};
