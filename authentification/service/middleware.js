const express = require('express');

const isLoggedIn = (req, res, next) => {
	console.log(req.session)
	if (req.session.passport) {
		next();
	} else {
		res.status(403).send('You must be logged in to view this page');
	}
};

module.exports = isLoggedIn;