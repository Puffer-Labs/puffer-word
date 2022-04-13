const User = require('../schema/user');
const bcrypt = require('bcrypt');
const passport = require('../config/passportConfig');

const isLoggedIn = (req, res, next) => {
	if (req.cookies.user) {
		next();
	} else {
		res.status(403).send('You must be logged in to view this page');
	}
};

// const login = async (req, res, next) => {
// 	const { username, password } = req.body;
// 	let user = await User.findOne({ username: username });
// 	if (!user) {
// 		res.status(401).send('User not found');
// 	}
// 	bcrypt.compare(password, user.password, (err, result) => {
// 		if (err) {
// 			res.status(500).send({ error: err.message, msg: 'error comparing passwords' });
// 		}
// 		if (result) {
// 			req.session.login = { user: user.username };
// 			req.user = user;
// 			next();
// 		}
// 	});
// };

const authorize = (req, res, next) => {
	passport.authenticate('local', {}, (err, user) => {
		console.log(err);
		if (err) {
			res.status(500).send({ error: err.message });
		}
		if (!user) {
			res.status(401).send('User not found');
		}
		if (user) {
			req.session.passport = { user: user.username };
			req.user = user;
			next();
		}
	})(req, res, next);
};

const logout = (req, res, next) => {
	req.session.passport = null;
	req.user = null;
	next();
};

module.exports = { isLoggedIn, logout, authorize };
