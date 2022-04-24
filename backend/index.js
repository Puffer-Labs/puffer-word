// Imports
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const parser = require("morgan-body");

const documentController = require("./controller/documentController");
const mediaController = require("./controller/mediaController");
const authController = require("./controller/authController");
const authMiddleware = require("./middleware/authMiddleware");


// Express Setup
const api = express();
const port = 8000;
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

// Configs
const passport = require("./config/passportConfig");
const mongoDBClient = require("./config/mongoConfig");
const elasticConfig = require("./config/elasticConfig");

// Import Setup
api.use(cookieParser());
api.use(
  // cors({
	//   origin: ["http://pufferlabs.cse356.compas.cs.stonybrook.edu", "http://localhost:3000"],
  //   credentials: true,
  // })
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
api.use(
  session({
    secret: "fart",
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 1000 * 10000, //10 seconds
      sameSite: true,
      secure: false,
    },
    resave: true,
    rolling: true, //updates the cookie expiration time
  })
);
api.use(passport.initialize());
api.use(passport.session());
//api.use(logger("dev"));

// parser(api);

// Controllers
api.use((req, res, next) => {
	res.setHeader("X-CSE356", "61f9d6733e92a433bf4fc8dd");
	next();
});
api.use("/users", authController);
api.use("/media", authMiddleware.isLoggedIn, mediaController);
api.use("/", documentController);

api.get("/cookie", (req, res) => {
  console.log(req.cookies);
  res.send("Hello World!");
});

const backend = api.listen(port, async () => {
  console.log(`API running on port ${port}`);
  

});

process.on("SIGINT", () => {
  //graceful shutdown, close db connection
  backend.close(() => {
    mongoDBClient.close();
    console.log("Server closed. Database instance disconnected");
  });
  process.exit();
});
