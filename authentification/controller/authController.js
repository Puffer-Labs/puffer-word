const express = require("express");
const router = express.Router();
const passport = require("../config/passportConfig");
const authService = require("../service/authService");
const middleware = require("../service/middleware");

router.get("/users", (req, res) => {
  authService.getAllUsers(res);
});

router.post("/users/create", (req, res) => {
  authService.createUser(req, res);
});

router.post("/login", middleware.authorize, (req, res) => {
  res.cookie("user", req.user.username, {
    path: "/",
    maxAge: 10 * 1000,
    sameSite: true,
    secure: false,
  });
  res.status(200).send({ name: req.user.username });
});

router.get("/me", middleware.isLoggedIn, (req, res) => {
  res.status(200).send({ me: req.user, session: req.session });
});

router.get("/logout", middleware.isLoggedIn, middleware.logout, (req, res) => {
  console.log(req.session);
  req.session.destroy(function (err) {
    res.clearCookie("connect.sid");
    res.clearCookie("user");
    res.status(200).send({ msg: "logged out" });
  });
});

module.exports = router;
