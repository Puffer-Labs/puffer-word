const  { createClient } = require("redis");

const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));

const initRedis = async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
};
initRedis();

module.exports = redisClient;
