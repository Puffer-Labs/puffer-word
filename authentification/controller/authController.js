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
			//create cookie that contains user's id and expires in 6 hours
			res.cookie('user', req.user.username, {
				path: '/',
				expires: new Date(Date.now() + 6 * 60 * 60 * 1000)
			});
			res.status(200).send('Logged in');

		}
	});
});

router.get('/me', isLoggedIn, (req, res) => {

	res.status(200).send(req.user);
});

router.get('/logout', function(req,res){
	req.logOut();
	res.status(200).clearCookie('connect.sid', {
	  path: '/',
	  secure: false,
	  httpOnly: false,
	  domain: 'http://localhost:3000',
	  sameSite: true,
	});
	req.session.destroy(function (err) {
	  res.redirect('/');
	});
  });

module.exports = router;
