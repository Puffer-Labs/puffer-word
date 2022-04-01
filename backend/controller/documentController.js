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

  //TODO, error return-
});

//get document contents
documentRouter.get("/data/:id", (req, res) => {
  const id = req.params.id;
  try {
    documentService.getDocumentData(id, res);
  } catch (err) {
    console.log(err);
  }
});

documentRouter.post("/doc/:id", (req, res) => {
  documentService.postOps(req.params.id, req.body, res);
});

module.exports = documentRouter;
