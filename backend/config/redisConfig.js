const redis = require("redis");
const Bull = require("bull");
const REDIS_PORT = 6379;
const REDIS_HOST = "http://localhost";

const redisClient = redis.createClient();

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

redisClient.on("connect", function () {
  console.log("Redis client connected");
});

const docQueue = new Bull("doc-queue");

const initQueue = () => {
  const { getConnection } = require("./sharedbConfig");
  docQueue.process(async function (job) {
    try {
      const data = job.data;
      const { id, op } = JSON.parse(data.data);
      const document = getConnection().get("documents", id);
      document.submitOp(op);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  redisClient,
  docQueue,
  initQueue,
};
