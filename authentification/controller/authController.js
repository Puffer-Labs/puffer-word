const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const User = require('../schema/user');
const authService = require('../service/authService');
const isLoggedIn = require('../service/middleware');

router.get('/users', (req, res) => {
	authService.getAllUsers(res);
});

router.post('/users/signup', async(req, res) => {
	const newUser = await authService.createUser(req, res);
		// Must send confirmation link to emails
	console.log(newUser)
	// Email service to send the code


    res.status(201).send({ user: newUser })
});

router.post('/users/login', (req, res) => {
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

router.get('/users/logout', function(req,res){
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

//Verify user endpoint
router.get('/users/verify/:confirmationCode', function(req, res) {
	User.findOne({
		confirmationCode: req.params.confirmationCode
	})
	.then((user) => {
		if(!user){
			return res.status(404).send({message: "User not found."})
		}
		user.status = true
		user.save((err) => {
			if(err){
				res.status(500).send({message: err});
				return
			}
		})
		console.log(user)

	})
	.catch((e) => console.log("error", e));
})

module.exports = router;
