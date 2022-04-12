const mongoose = require('mongoose');
const schema = mongoose.Schema;
let uuid = require('uuid')

const userSchema = new schema({
	username: { type: String, required: true, unique: true },
	email: {type: String, required: true, unique: true},
	password: { type: String, required: true },
	status: {type: Boolean, default: false},
	confirmationCode: {type: String, default: uuid.v4(), unique: true}
})

module.exports = mongoose.model('User', userSchema);
