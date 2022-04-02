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

documentRouter.get("/html/:id", (req, res) => {
  const id = req.params.id;
  try {
    documentService.getDocumentHTML(id, res);
  } catch (err) {
    console.log(err);
  }
});

module.exports = documentRouter;
