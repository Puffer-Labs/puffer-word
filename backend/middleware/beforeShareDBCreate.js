const generateRandomID = require("../utils/idGenerator");

const beforeCreate = function (context, next) {
  if (context.collectionName === "documents") {
    context.documentToWrite.name = context.documentToWrite._id.split("~")[0];
    context.documentToWrite._id = context.documentToWrite._id.split("~")[1];
  }
  next();
};

module.exports = beforeCreate;