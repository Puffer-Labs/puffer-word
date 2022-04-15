const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const port = 8080;
const passport = require("./config/passportConfig");
const authController = require("./controller/authController");
const cors = require("cors");
require("./config/mongoConfig");
const sharedbRouter = require("./gateway/sharedbRouter");




app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "fart",
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 1000 * 10000, //10 seconds
      sameSite: 'none',
      secure: false,
    },
    resave: true,
    rolling: true, //updates the cookie expiration time
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.setHeader("X-CSE356", "61f9d6733e92a433bf4fc8dd")
  next();
});
app.use("/users", authController);
app.use("/", sharedbRouter);


app.get("/", (req, res) => {
  res.send({ msg: "Hello world" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
