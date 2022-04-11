const beforeCreate = function (context, next) {
  if (context.collectionName === "documents") {
    context.documentToWrite.name = "fart";
    context.documentToWrite._id = "1234";
  }
  next();
};

module.exports = beforeCreate;