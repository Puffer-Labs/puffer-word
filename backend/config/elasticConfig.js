const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username:process.env.ELASTIC_USERNAME,
    password:process.env.ELASTIC_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    ca: process.env.ELASTIC_SSL
    }
});

module.exports = client;
