const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const port = 8080;
const passport = require('./config/passportConfig');
const authController = require('./controller/authController');
require('./config/mongoConfig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cookieSession({
		name: 'session',
		keys: [ 'fart' ],
		maxAge: 24 * 60 * 60 * 1000 //24 hours
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/', authController);

app.get('/', (req, res) => {
	res.send({ msg: 'Hello world' });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
