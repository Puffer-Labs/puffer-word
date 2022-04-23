import http from 'k6/http';
import { sleep, check } from 'k6';

const url = [ 'http://localhost:8000/users/login', 'http://localhost:8000/collection/create' ];

export const options = {
	vus: 400,
	iterations: 400
};

export function setup() {
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
	const users = setup();
	const user = users[__VU];

	//login request sent
	const res = http.post(url[0], user);
	const vuJar = http.cookieJar();

	if (res.status !== 200) {
		check(res, {
			'login failed': (r) => r.status === 404
		});
	} else {
		check(res, {
			'is status 200': (r) => r.status === 200,
			'is cookie set': (r) => r.cookies['user'] !== undefined
		});
	}
	const newDocName = {
		name: `test${__VU} Doc`
	};
	//request to create new doc
	const res2 = http.post(url[1], newDocName, { cookies: vuJar });
	if (__VU > 400) {
		check(res2, {
			'is status 401 for not Logged in': (r) => r.status === 401
		});
	}
	check(res2, {
		'is status for doc 200': (r) => r.status === 200
	});

	sleep(1);
}
