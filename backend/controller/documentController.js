const express = require("express");
const documentRouter = express.Router();
const documentService = require("../service/documentService");

//get stream and connect to document
documentRouter.get("/doc/connect/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  const email = req.cookies.user;

  try {
    documentService.connectToDocument(docId, uId, res, email);
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

documentRouter.get("/doc/get/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  try {
    documentService.getDocumentHTML(docId, uId, res);
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

documentRouter.post("/doc/op/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  const data = req.body;
  console.log(data);
  try {
    documentService.postOp(docId, uId, data, res)
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

documentRouter.post("/doc/presence/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  const range = req.body;
  try {
    documentService.submitPresenceRange(docId, uId, range, res);
    res.json("success");
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

documentRouter.post("/collection/create", (req, res) => {
  const name = req.body.name;
  try {
    const docid = documentService.createDocument(name, res);
    res.status(200).send({ docid });
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

documentRouter.delete("/collection/delete", (req, res) => {
  const id = req.body.docid;
  try {
    documentService.deleteDocument(id, res);
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

documentRouter.get("/collection/list", async (req, res) => {
  try {
    const docs = await documentService.getDocuments(res);
    res.send(docs);
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

module.exports = documentRouter;
