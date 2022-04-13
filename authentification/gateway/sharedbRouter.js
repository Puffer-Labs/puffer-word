const proxy = require("express-http-proxy");
const { isLoggedIn } = require("../service/middleware");

const sharedbAPI = (req, res) => {
  isLoggedIn(req, res, () => proxy("http://localhost:8000")(req, res));
};

module.exports = sharedbAPI;
