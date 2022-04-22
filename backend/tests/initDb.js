const mongoose = require('../config/mongoConfig');
const authService = require('../service/authService');

const initTestUsers = async () => {
	for (let i = 0; i < 400; i++) {
		let newUser = {
			name: `test${i}`,
			password: 'test',
			email: `test${i}@test.com`,
			status: true
		};
		authService.createTestUser(newUser);
	}
	console.log('Users created');
	return;
};

initTestUsers();
