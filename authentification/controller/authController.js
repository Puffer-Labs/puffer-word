const express = require("express");
const router = express.Router();
const passport = require("../config/passportConfig");
const authService = require("../service/authService");

router.get("/users", (req, res) => {
  authService.getAllUsers(res);
});

router.post("/users/create", (req, res) => {
  authService.createUser(req, res);
});

router.post("/login", (req, res) => {
  req.login(req.body, (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      //create cookie that contains user's id and expires in 10 seconds
      res.cookie("user", req.user.username, {
        expires: new Date(Date.now() + 10000),
      });
      res.status(200).send("Logged in");
    }
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send("Logged out");
});

module.exports = router;
