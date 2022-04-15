const express = require("express");
const email = require("../config/nodeMailerConfig");
const router = express.Router();
const proxy = require('express-http-proxy');
const passport = require('../config/passportConfig');
const authService = require('../service/authService');
const middleware = require('../service/middleware');

/**
 * TODO: Refactor Controller code into service layer
 */

router.post("/signup", async (req, res) => {
  const newUser = await authService.createUser(req, res);
  // let info = await email.transporter.sendMail({
  //   from: "Puffer labs <verify@softpaddle.com>",
  //   to: newUser.email,
  //   subject: "Welcome to Puffer labs",
  //   text: `Welcome to Puffer labs, ${newUser.username}! This is your confirmation link.`,
  //   html: `<a href=http://localhost:8080/users/verify?key=${newUser.confirmationCode}>Verify Email</a>`,
  // });
  res.status(201);
});

router.post("/login", middleware.authorize, (req, res) => {
  res.cookie("user", req.user.username, {
    path: "/",
    maxAge: 10 * 1000 * 10000,
    sameSite: true,
    secure: false,
  });
  res.status(200).send({ name: req.user.username });
});

router.get("/verify", (req, res) => {
  User.findOne({ confirmationCode: req.query.key })
    .then((user) => {
      if (!user) {
        return res.status(404).send({error: true, message: "User not found" });
      }
      user.status = true;
      user.save((err) => {
        if (err) {
          return res.status(500).send({error:true, message: err.message });
        }
      });
      res.status(200).send({ user: user });
    })
    .catch((e) => console.log("error", e));
});

router.get(
  "/logout",
  [middleware.isLoggedIn, middleware.logout],
  (req, res) => {
    console.log(req.session);
    req.session.destroy(function (err) {
      res.clearCookie("connect.sid");
      res.clearCookie("user");
      res.status(200);
    });
  }
);



module.exports = router;
