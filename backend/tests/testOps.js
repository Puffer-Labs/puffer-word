import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
// import uuid from './uuid.js';

const url = [
	'http://localhost:8000/users/login',
	'http://localhost:8000/doc/connect',
	'http://localhost:8000/doc/op',
	'http://localhost:8000/collection/list'
];

export const options = {
	stages: [ { duration: '10s', target: 20 }, { duration: '10s', target: 0 } ]
	// vus: 10,
	// iterations: 10
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

export function getListOfDocs() {
	const user = {
		email: `test0@test.com`,
		password: 'test'
	};
	let res = http.post(url[0], user);
	const vuJar = http.cookieJar();

	res = http.get(url[3], { cookies: vuJar });
	// console.log(res.body);
	return res.json();
}

export default function() {
	const users = setup();
	const docs = getListOfDocs();
	const user = users[__VU];
	//login request sent
	const res = http.post(url[0], user);
	const vuJar = http.cookieJar();
	check(res, {
		'is login status 200': (r) => r.status === 200
	});

	let doc = docs[Math.floor(Math.random() * docs.length)];
	let newId = uuidv4();
	const res2 = http.get(url[1] + `/${doc.id}/${newId}`, { cookies: vuJar });
	console.log(res2.body);
	check(res2, {
		'conneted to doc': (r) => r.status === 200
	});
	sleep(1);
}
