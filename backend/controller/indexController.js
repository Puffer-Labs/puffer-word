const express = require("express");
const indexRouter = express.Router();
const indexService = require("../service/indexService");

indexRouter.get("/search", async (req, res) => {
  const query = req.query.q;
  const docs = await indexService.searchDocuments(query, res);
  res.status(200).send(docs);
});

indexRouter.get("/suggest", async (req, res) => {
  const query = req.query.q;
  const docs = await indexService.suggest(query, res);
  res.status(200).send(docs);
});

module.exports = indexRouter;
