const express = require("express");
const cors = require("cors");
const api = express();
const port = 8000;

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cors());

const documentController = require("./controller/documentController");
api.use("/", documentController);
api.get("/", (req, res) => {
  res.send("Hello World!");
});

const api_instance = api.listen(port, () => {
  console.log(`API running on port ${port}`);
});

