const express = require('express');

const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.send('You must be logged in to view this page');
	}
};

module.exports = isLoggedIn;
