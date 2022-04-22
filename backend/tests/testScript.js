import http from 'k6/http';
import { sleep, check } from 'k6';

const url = [ 'http://localhost:8000/users/login', 'http://localhost:8000/collection/list' ];

//options for k6
//current options are: checking % of failed requests
export const options = {
	thresholds: {
		http_req_failed: [ 'rate<0.01' ]
	}
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

	let res = http.post(url[0], user);
	const vuJar = http.cookieJar();

	//commented out bc you can only run one check, I think
	console.log(res.cookies['user'][0].value); //prints cookie values
	check(res, {
		'is status 200': (r) => r.status === 200,
		'is cookie set': (r) => r.cookies['user'] !== undefined
	});

	let res2 = http.get(url[1], { cookies: vuJar });
	console.log(res2.body);
	check(res2, {
		'is status for doc 200': (r) => r.status === 200
	});

	sleep(1);
}
