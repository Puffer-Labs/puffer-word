const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);
const sharedb_server = new ShareDB();


sharedb_server.use('beforeCreate', function(context, next) {
  if (context.collectionName === 'documents') {
    context.documentToWrite.name = context.options.name;
    context.documentToWrite.id = '1234';
  }
  next(error);
});
const sharedb_connection = sharedb_server.connect();
const document = sharedb_connection.get("documents", "default");
document.submitSource = true;

module.exports = { sharedb_server, sharedb_connection, document };
