const express = require("express");
const documentRouter = express.Router();
const documentService = require("../service/documentService");

//get stream and connect to document
documentRouter.get("/connect/:id", (req, res) => {
  const id = req.params.id;
  try {
    documentService.getDocument(id, res);
  } catch (err) {
    console.log(err);
  }
});

documentRouter.get("/doc/:id", (req, res) => {
  const id = req.params.id;
  try {
    documentService.getDocumentHTML(id, res);
  } catch (err) {
    console.log(err);
  }
});

documentRouter.post("/op/:id", (req, res) => {
  const id = req.params.id;
  const ops = req.body;
  try {
    documentService.postOps(id, ops, res);
  } catch (err) {
    console.log(err);
  }
});

module.exports = documentRouter;
