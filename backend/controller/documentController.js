const express = require("express");
const documentRouter = express.Router();
const documentService = require("../service/documentService");

//get stream and connect to document
documentRouter.get("/doc/connect/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.connectToDocument(docId, uId, res);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

documentRouter.get("/doc/get/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.getDocumentHTML(docId, uId, res);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

documentRouter.post("/doc/op/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  const data = req.body;
  console.log(data);
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    if (documentService.postOp(docId, uId, data, res)) {
      res.status(200).send({ status: "ok"});
    } else {
      res.status(400).send({ status: "retry"})
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

documentRouter.post("/doc/presence/:docId/:uId", (req, res) => {
  const docId = req.params.docId;
  const uId = req.params.uId;
  const range = req.body;
  try {
    documentService.submitPresenceRange(docId, uId, range);
    res.json("success");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

documentRouter.post("/collection/create", (req, res) => {
  const name = req.body.name;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    const docid = documentService.createDocument(name, res);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

documentRouter.delete("/collection/delete", (req, res) => {
  const id = req.body.docid;
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    documentService.deleteDocument(id);
    res.send("success");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

documentRouter.get("/collection/list", async (req, res) => {
  res.set("X-CSE356", "61f9d6733e92a433bf4fc8dd");
  try {
    const docs = await documentService.getDocuments();
    res.send(docs);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = documentRouter;
