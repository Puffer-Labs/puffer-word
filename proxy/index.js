const express = require("express");
const port = 8000;
const request = require("request");
const redisClient = require("./config/redisConfig");

const servers = ["8001", "8002", "8003", "8004"];

const forwardRequest = (req, res, port) => {
  console.log("http://localhost:" + port + req.url);
  req.pipe(request({ url: "http://localhost:" + port + req.url })).pipe(res);
};
const requestHandler = async (req, res) => {
  const targetEndpoint = req.url;
  //if url contains /doc/
  if (targetEndpoint.includes("/doc/")) {
    //strucutre of url should be /doc/<action>/docId/...
    const docId = targetEndpoint.split("/")[3];
    const idExists = await redisClient.exists(docId);
    if (idExists) {
      const destPort = await redisClient.get(docId);
      forwardRequest(req, res, destPort);
    } else {
      //send to random server
      //      const randomPort = servers[Math.floor(Math.random() * servers.length)];
      const randomPort = "8001";
      await redisClient.set(docId, randomPort);
      forwardRequest(req, res, randomPort);
    }
  } else {
    //pick random server to send request to
    //const randomPort = servers[Math.floor(Math.random() * servers.length)];
    const randomPort = "8001";
    forwardRequest(req, res, randomPort);
  }
};

const app = express()
  .get("*", requestHandler)
  .post("*", requestHandler)
  .put("*", requestHandler)
  .delete("*", requestHandler);
app.listen(port, async () => {
  console.log(`Proxy app listening on port ${port}`);
});
