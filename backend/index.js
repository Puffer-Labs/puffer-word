const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api = express();
const port = 8000;

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cookieParser());
api.use(cors());
api.use(logger('dev'));

// parser(api);

const documentController = require("./controller/documentController");
const mediaController = require("./controller/mediaController");
const mongoDBClient = require("./config/mongoConfig");
api.use("/media", mediaController);
api.use("/", documentController);

api.get("/fart", (req, res) => {
  console.log(req.cookies);
  res.send("Hello World!");
});

api.listen(port, () => {
	console.log(`API running on port ${port}`);
});

process.on("SIGINT", () => {
  //graceful shutdown, close db connection
  api.close(() => {
    mongoDBClient.close();
    console.log("Server closed. Database instance disconnected");
  });
  process.exit();
});

process.on("SIGINT", () => {
  //graceful shutdown, close db connection
  api_instance.close(() => {
    mongoDBClient.close();
    console.log("Server closed. Database instance disconnected");
  });
  process.exit();
});

