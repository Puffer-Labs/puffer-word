const nodemailer = require("nodemailer");

const email = "verify@softpaddle.com";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const mail = {
  transporter,
  email,
};

module.exports = mail;
