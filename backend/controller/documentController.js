const express = require("express");
const documentRouter = express.Router();
const documentService = require("../service/documentService");

documentRouter.get("/connect/:id", (req, res) => {
  const id = req.params.id;
  try {
    const document = documentService.getDocument(id, res);
  } catch (err) {
    console.log(err);
  }

  //TODO, error return-
});

module.exports = documentRouter;
