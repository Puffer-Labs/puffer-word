const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	secure: false,
	auth: {
		user: 'delpha.roberts92@ethereal.email',
		pass: 'S4pck5HnDBkr5yAXX7'
	}
});

module.exports = transporter;
