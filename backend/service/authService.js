const user = require('../schema/user');
const bcrypt = require('bcrypt');
const mail = require('../config/nodeMailerConfig');

/**
 * @param {Request} req
 * @param {Response} res
 * @returns 201 Created | 500 Server Error
 *
 * @description Creates a user, then uses the user's email to send a confirmation email.
 */
const createUser = async (req, res) => {
	const { name, email, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		let newUser = await user.create({
			name: name,
			password: hashedPassword,
			email: email
		});
		// let info = await mail.transporter.sendMail({
		//   from: "Puffer labs <verify@softpaddle.com>",
		//   to: newUser.email,
		//   subject: "Welcome to Puffer labs",
		//   text: `http://pufferlabs.cse356.compas.cs.stonybrook.edu/users/verify?key=${newUser.confirmationCode}`,
		//   html: `<a href=http://pufferlabs.cse356.compas.cs.stonybrook.edu/users/verify?key=${newUser.confirmationCode}>http://pufferlabs.cse356.compas.cs.stonybrook.edu/users/verify?key=${newUser.confirmationCode}</a>`,
		// });
		res.status(200).send({});
	} catch (err) {
		console.log(err);
		res.status(500).send({ error: true, message: err.message });
	}
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Cookie with user email
 *
 * @description This simply assigns the user's email to a cookie. Login is handled by authorize function in middleware.
 */
const loginUser = (req, res) => {
	res.cookie('user', req.user.email, {
		path: '/',
		maxAge: 10 * 1000 * 1000,
		sameSite: true,
		secure: false
	});
	res.status(200).send({ name: req.user.name });
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns 200 OK | 500 Server Error | 404 Not Found
 *
 * @description  Looks up user by confirmation code and sets the user's confirmed field to true. Resaves the user.
 */
const verifyUser = (req, res) => {
	user
		.findOne({ confirmationCode: req.query.key })
		.then((user) => {
			if (!user) {
				return res.status(404).send({ error: true, message: 'User not found' });
			}
			user.status = true;
			user.save((err) => {
				if (err) {
					return res.status(500).send({ error: true, message: err.message });
				}
			});
			res.status(200).send({ user: user });
		})
		.catch((e) => console.log('error', e));
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns 200 OK
 *
 * @description clears session cookies. Rest of logout is handled by logout function in middleware.
 */
const logout = (req, res) => {
	req.session.destroy(function(err) {
		res.clearCookie('connect.sid');
		res.clearCookie('user');
		res.sendStatus(200);
	});
};

const createTestUser = async (testUser) => {
	const { name, email, password, status } = testUser;
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		let newUser = await user.create({
			name: name,
			password: hashedPassword,
			email: email,
			status: status
		});
		return;
	} catch (err) {
		console.log(err);
		return { error: true, message: err.message };
	}
};

module.exports = { createUser, loginUser, verifyUser, logout, createTestUser };
