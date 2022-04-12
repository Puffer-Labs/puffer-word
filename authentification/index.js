const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = 8080;
const passport = require('./config/passportConfig');
const authController = require('./controller/authController');
const cors = require('cors')
require('./config/mongoConfig');


app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}))

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	session({
		secret: 'fart',
		saveUninitialized: false,
		cookie: {
			maxAge: 6 * 60 * 60 * 1000,
		},
		secure: true,
		resave: true,
		rolling: true //updates the cookie expiration time
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
