const amqp = require("amqplib/callback_api");
const CONN_URL = "amqp://localhost";
let ch = null;
amqp.connect(CONN_URL, (err, conn) => {
  if (err) console.log(err);

  conn.createChannel((err, channel) => {
    if (err) console.log(err);
    ch = channel;
  });
});

const publish = async (queue, data) => {
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};

process.on("exit", () => {
  ch.close();
});

module.exports = {
  publish,
};
