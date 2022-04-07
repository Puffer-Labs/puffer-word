const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const authService = require('../service/authService');
const isLoggedIn = require('../service/middleware');

router.get('/users', (req, res) => {
	authService.getAllUsers(res);
});

router.post('/users/create', (req, res) => {
	authService.createUser(req, res);
});

router.post('/login', (req, res) => {
	req.login(req.body, (err) => {
		if (err) {
			res.status(500).send({ error: err.message });
		} else {
			res.status(200).send('Logged in');
		}
	});
});

router.get('/logout', (req, res) => {
	req.session = null;
	req.logout();
	res.status(200).send('Logged out');
});

// router.get('/session/data', isLoggedIn, (req, res) => {
// 	authService.getSessionData(req, res);
// });

module.exports = router;
