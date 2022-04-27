import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { API } from './constants';

const cookies = new Cookies();
const Auth = () => {
	const navigate = useNavigate();
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ rUsername, setRUsername ] = useState('');
	const [ rPassword, setRPassword ] = useState('');
	const [ rEmail, setREmail ] = useState('');

	const handleLogin = async () => {
		await axios
			.post(
				`${API}/users/login`,
				{
					email: username,
					password: password
				},
				{ withCredentials: true }
			)
			.then((res) => {
				console.log(cookies.getAll());
				if (cookies.get('name') !== null) {
					navigate('/home');
				} else {
					console.log('Please login');
				}
			});
	};

	const handleLogout = () => {
		axios.get(`${API}/users/logout`).then((res) => {
			let d = new Date();
			d.setTime(d.getTime() + 0);
			cookies.set('user', 'temp', { path: '/', expires: d });
			console.log(cookies.getAll());
			navigate('/');
		});
	};

<<<<<<< HEAD
  const handleRegister = async () => {
    await axios.post(`${API}/users/signup`, {
      name: rUsername,
      email: rEmail,
      password: rPassword,
    });
  };

  return (
    <div>
      <div>
        Login
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => handleLogin()}>Login</button>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
      <div>
        Register
        <input
          placeholder="Username"
          value={rUsername}
          onChange={(e) => setRUsername(e.target.value)}
        />
        <input
          placeholder="Email"
          value={rEmail}
          onChange={(e) => setREmail(e.target.value)}
        />
        <input
          placeholder="Password"
          value={rPassword}
          type="password"
          onChange={(e) => setRPassword(e.target.value)}
        />
        <button onClick={() => handleRegister()}>Register</button>
      </div>
    </div>
  );
=======
	const handleRegister = async () => {
		await axios.post(`${API}/users/signup`, {
			name: rUsername,
			email: rEmail,
			password: rPassword
		});
	};

	return (
		<div>
			<div>
				Login
				<input
					id="login-username"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					id="login-password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button id="login-btn" name="login-btn" onClick={() => handleLogin()}>
					Login
				</button>
				<button onClick={() => handleLogout()}>Logout</button>
			</div>
			<div>
				Register
				<input
					id="register-username"
					placeholder="Username"
					value={rUsername}
					onChange={(e) => setRUsername(e.target.value)}
				/>
				<input
					id="register-email"
					placeholder="Email"
					value={rEmail}
					onChange={(e) => setREmail(e.target.value)}
				/>
				<input
					id="register-password"
					placeholder="Password"
					value={rPassword}
					onChange={(e) => setRPassword(e.target.value)}
				/>
				<button onClick={() => handleRegister()}>Register</button>
			</div>
		</div>
	);
>>>>>>> 7fbe94211197dc22692a4ecd553014b9d0e5713b
};

export default Auth;
