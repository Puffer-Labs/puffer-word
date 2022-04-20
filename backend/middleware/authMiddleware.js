const passport = require('../config/passportConfig');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 *
 * @description middleware that checks if user is logged in by checking if req.session.passport is set
 * if the user is not logged in, it will send a 401 status code
 */

const isLoggedIn = (req, res, next) => {
	if (req.session.passport) {
		next();
	} else {
		res.status(401).send({
			error: true,
			message: 'You must be logged in to access this resource.'
		});
	}
};

/**
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns 500 Server Error | 404 Not Found | Next (moves onto next middleware or routes if there is no middleware)
 *
 * @description middleware that logs in the user through passport
 * on sucess req.user is set to the user object and
 * req.session.passport is set to the user's username
 * next() is called moving onto the next middleware or if there's none, the route
 *
 * if there is an error with passport it will send a 500 status code
 * If the user is not found it will send a 404 status code
 */

const authorize = (req, res, next) => {
	passport.authenticate('local', {}, (err, user) => {
		if (err) {
			res.status(500).send({ error: true, message: 'There was an error with the request.' });
		}
		if (!user) {
			res.status(404).send({ error: true, message: 'User was not found.' });
		}
		if (user) {
			req.session.passport = { user: user.username };
			req.user = user;
			next();
		}
	})(req, res, next);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 *
 * @description middleware that removes passport from the session object
 * also clears user from req.user
 */

const logout = (req, res, next) => {
	req.session.passport = null;
	req.user = null;
	next();
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 * 
 * @description checks if the user is verified. User needs to be logged in
 */
const isVerified = (req, res, next) => {
	if (req.user.status) {
		next();
	} else {
		res.status(401).send('You must verify your account');
	}
};

module.exports = {
	isLoggedIn,
	logout,
	authorize,
	isVerified
};
