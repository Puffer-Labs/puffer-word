const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "Fanr*xDz_64i2p1*kEnJ",
  },
  tls: {
    ca: fs.readFileSync("/Users/sherzodnimatullo/Desktop/http_ca.crt"),
    rejectUnauthorized: false,
  },
});

module.exports = client;
