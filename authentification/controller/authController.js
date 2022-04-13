const express = require("express");
const router = express.Router();
const passport = require("../config/passportConfig");
const User = require("../schema/user");
const authService = require("../service/authService");
const middleware = require("../service/middleware");

router.get("/users", (req, res) => {
  authService.getAllUsers(res);
});

router.post("/users/create", async (req, res) => {
  const newUser = await authService.createUser(req, res);
  res.status(201).send({ user: newUser });
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

router.get("/me", middleware.isLoggedAndVerified, (req, res) => {
  res.status(200).send({ me: req.user, session: req.session });
});

router.get("/users/verify/:confirmation", (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmation })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      user.status = true;
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
      });
      res.status(200).send({ user: user });
    })
    .catch((e) => console.log("error", e));
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
