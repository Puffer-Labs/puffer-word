const nodemailer = require("nodemailer");

const email = "verify@softpaddle.com";

const transporter = nodemailer.createTransport({
  host: "softpaddle.com",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "softpaddle",
    pass: "verifyuser",
  },
});

const mail = {
  transporter,
  email,
};

module.exports = mail;
