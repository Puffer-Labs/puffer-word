const express = require('express');
const email = require('../config/nodeMailerConfig');
const router = express.Router();
const User = require('../schema/user');
const authService = require('../service/authService');
const middleware = require('../middleware/authMiddleware');

/**
 * TODO: Refactor Controller code into service layer
 */

router.post('/signup', async (req, res) => {
	authService.createUser(req, res);
});

router.post('/login', [middleware.isVerified, middleware.authorize], (req, res) => {
	authService.loginUser(req, res);
});

router.get('/verify', (req, res) => {
	authService.verifyUser(req, res);
});

router.get('/logout', [ middleware.isLoggedIn, middleware.logout ], (req, res) => {
	authService.logout(req, res);
});

// Remove the + and everything  after up to the @ from the email
function removeDelimeterFromEmail(email) {
	return email.split('+')[0].join("@").split('@')[1];
}


module.exports = router;
