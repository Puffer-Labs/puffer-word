const express = require("express");
const documentRouter = express.Router();
const documentService = require("../service/documentService");

documentRouter.get("/connect/:id", (req, res) => {
  const id = req.params.id;
  documentService.getDocument(id);
});
