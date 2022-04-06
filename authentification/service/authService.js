const user = require('../schema/user');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		let newUser = await user.create({
			username: username,
			password: hashedPassword
		});
		res.status(201).send({ user: newUser });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

module.exports = { createUser };
