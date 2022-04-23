import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * This Test Logins in 400 users. then makes requests to retreive the current docs then logs out all users
 * There are 50 users that should not get logged in to test errors
 */

const url = [
	'http://localhost:8000/users/login',
	'http://localhost:8000/collection/list',
	'http://localhost:8000/users/logout'
];

//options for k6
export const options = {
	thresholds: {
		http_req_failed: [ 'rate<0.01' ]
	},
	vus: 400,
	iterations: 400
	// stages: [ { duration: '10s', target: 450 }, { duration: '10s', target: 0 } ] // first 10 seconds build up to 400 requests, then next 10 seconds to 0 requests
};

//setup test users
export function setUp() {
	let users = [];
	for (let i = 0; i < 400; i++) {
		users.push({
			email: `test${i}@test.com`,
			password: 'test'
		});
	}
	return users;
}

export default function() {
	let users = setUp();
	sleep(0.2); //sleep to make sure users are created
	let user = users[__VU]; //_VU is the virtual user number (0-399)

	//login user
	let res = http.post(url[0], user);
	const vuJar = http.cookieJar();

	//checking if less than 400 because init script only creates 400 users so anything over ID of 400 should fail
	if (__VU > 400) {
		check(res, {
			'login failed': (r) => r.status === 404
		});
	} else {
		check(res, {
			'is status 200': (r) => r.status === 200,
			'is cookie set': (r) => r.cookies['user'] !== undefined
		});
	}
	// console.log(res.cookies['user'][0].value); //prints cookie values

	//request to get collection list
	let res2 = http.get(url[1], { cookies: vuJar });
	if (__VU > 400) {
		check(res2, {
			'is status 401 for not Logged in': (r) => r.status === 401
		});
	} else {
		check(res2, {
			'is status for doc 200': (r) => r.status === 200
		});
	}

	//logout user
	let res3 = http.get(url[2], { cookies: vuJar });
	if (__VU > 400) {
		check(res3, {
			'is status 401 for not Logged in': (r) => r.status === 401
		});
	} else {
		check(res3, {
			'is status for logout 200': (r) => r.status === 200
		});
	}

	sleep(1);
}
