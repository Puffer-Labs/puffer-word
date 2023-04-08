const amqp = require("amqplib");

const QUEUE = "docQueue";

let instance;

class MessageBroker {
  constructor() {
    this.handlers = [];
  }

  async init() {
    this.connection = await amqp.connect("amqp://localhost");
    this.channel = await this.connection.createChannel();
    return this;
  }

  async publish(data) {
    if (!this.connection) {
      await this.init();
    }

    await this.channel.assertQueue(QUEUE, { durable: false });
    this.channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
  }

  async subscribe(handler) {
    if (!this.connection) {
      await this.init();
    }

    await this.channel.assertQueue(QUEUE, { durable: false });
    this.handlers.push(handler);
    this.channel.consume(QUEUE, async (msg) => {
      this.channel.ack(msg);
      this.handlers.forEach((handler) => handler(msg));
    });
  }
}

MessageBroker.getInstance = async () => {
  if (!instance) {
    const broker = new MessageBroker();
    instance = await broker.init();
  }
  return instance;
};

module.exports = MessageBroker;
