const mongoose = require('mongoose');
require('dotenv').config();
//DB_URL set to 'mongodb://localhost:27017/auth' in .env file
//made an env file until we are all using the same db

// mongoose.connect(process.env.DB_URL);
mongoose.connect("mongodb://localhost:27017/auth");
mongoose.connection.on('connected', () => {
	console.log('Connected to MongoDB');
});

module.exports = mongoose;
