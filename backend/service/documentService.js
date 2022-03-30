const ShareDB = require("../index");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");

const getDocument = async (id) => {
  const document = ShareDB.sharedb_connection.get("documents", id);
  document.fetch(() => {
    if (document.type === null) document.create([{ insert: "" }], "rich-text");
    const wsConnection = new WebSocket.Server({ port: 8080 });
    wsConnection.on("connection", (ws) => {
      ShareDB.sharedb_server.listen(new WebSocketJSONStream(ws));
      ws.send(
        JSON.stringify({
          data: { content: [{ insert: document.data }] },
        })
      );
    });
  });
};

module.exports = getDocument;
