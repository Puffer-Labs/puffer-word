const generateRandomID = require("../utils/idGenerator");

const beforeCreate = function (context, next) {
 
  next();
};

module.exports = beforeCreate;