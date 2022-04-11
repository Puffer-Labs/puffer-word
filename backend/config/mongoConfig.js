const { MongoClient } = require("mongodb");

const mongoDBClient = new MongoClient("mongodb://127.0.0.1:27017/test");

async function run() {
  try {
    // Connect the client to the server
    await mongoDBClient.connect();
    // Establish and verify connection
    await mongoDBClient.db("test").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch((err) => console.log(err));



module.exports = mongoDBClient;
