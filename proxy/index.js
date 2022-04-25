const express = require("express");
const app = express();
const port = 8000;
const redisClient = require("./config/redisConfig");

app.get("/docId/", async (req, res) => {
  const docId = req.query.docId;
  const processes = ["proc1", "proc2", "proc3", "proc4"];
  const idExists = await redisClient.exists(docId);
  if(idExists) {
      const proc = await redisClient.get(docId);
    res.send("THIS DOCUMENT IS ACTIVE, BEING SENT TO "+ proc);
    } else {
        const randomProcess = processes[Math.floor(Math.random() * processes.length)];
        await redisClient.set(docId, randomProcess);
        res.send("THIS DOCUMENT IS NOT ACTIVE, SENDING TO PROCESS "+ randomProcess);
    }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  await redisClient.set("test", "testValue");
  console.log(await redisClient.get("test"));
});
