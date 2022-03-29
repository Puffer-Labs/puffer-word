const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");

const ShareDB = require("sharedb");
ShareDB.types.register(require("rich-text").type);

const server = new ShareDB();
const connection = server.connect();

const document = connection.get("documents", "first");

document.fetch(() => {
  if (document.type === null) {
    document.create([{ insert: "" }], "rich-text", () => {
      const wsConnection = new WebSocket.Server({ port: 8080 });
      wsConnection.on("connection", (ws) => {
        server.listen(new WebSocketJSONStream(ws));
      });
    });
  }
});
