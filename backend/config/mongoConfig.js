const { MongoClient } = require("mongodb");

const mongoDBClient = new MongoClient("mongodb://127.0.0.1:27017/test");

async function run() {
  try {
    // Connect the client to the server
    await mongoDBClient.connect();
    // Establish and verify connection
    await mongoDBClient.db("test").command({ ping: 1 });
    console.log("Connected successfully to ShareDB DB");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch((err) => console.log(err));

const mongoose = require('mongoose');
// require('dotenv').config();
//DB_URL set to 'mongodb://localhost:27017/auth' in .env file
//made an env file until we are all using the same db

// mongoose.connect(process.env.DB_URL);
mongoose.connect("mongodb://127.0.0.1:27017/auth");
mongoose.connection.on('connected', () => {
	console.log("Connected successfully to Auth DB");
});

module.exports = {mongoose, mongoDBClient};

