const express = require("express");
const documentRouter = express.Router();
const documentService = require("../service/documentService");

//get stream and connect to document
documentRouter.get("/connect/:id", (req, res) => {
  const id = req.params.id;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.connectToDocument(id, res);
  } catch (err) {
    console.log(err);
  }
});

documentRouter.get("/doc/:id", (req, res) => {
  const id = req.params.id;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.getDocumentHTML(id, res);
  } catch (err) {
    console.log(err);
  }
});

documentRouter.post("/op/:id", (req, res) => {
  const id = req.params.id;
  const ops = req.body;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.postOps(id, ops, res);
  } catch (err) {
    console.log(err);
  }
});

documentRouter.post("/presence/:id", (req, res) => {
  const range = req.body;
  const id = req.params.id;
  try {
    documentService.submitPresenceRange(id, range);
    res.json("success");
  } catch (err) {
    console.log(err);
  }
});

documentRouter.post("/collection/create", (req, res) => {
  const name = req.body.name;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    const docid = documentService.createDocument(name, res);
  }
  catch (err) {
    console.log(err);
  }
});

documentRouter.delete("/collection/delete", (req, res) => {
  const id = req.body.docid;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.deleteDocument(id);
    res.send("success");
  }
  catch (err) {
    console.log(err);
  }
});

documentRouter.get("/collection/list", async (req, res) => {
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    const docs = await documentService.getDocuments();
    res.send(docs);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = documentRouter;
