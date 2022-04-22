const { Client } = require("@elastic/elasticsearch");
const elasticsearchClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username:process.env.ELASTIC_USERNAME,
    password:process.env.ELASTIC_PASSWORD,
  },
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.ELASTIC_SSL
    }
});

module.exports = elasticsearchClient;
