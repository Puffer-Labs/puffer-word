import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import { API } from "./constants";

const cookies = new Cookies();
const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rUsername, setRUsername] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rEmail, setREmail] = useState("");

  const handleLogin = async () => {
    await axios
      .post(
        `${API}/users/login`,
        {
          email: username,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(cookies.getAll());
        if (cookies.get("name") !== null) {
          navigate("/home");
        } else {
          console.log("Please login");
        }
      });
  };

  const handleLogout = () => {
    axios.get(`${API}/users/logout`).then((res) => {
      let d = new Date();
      d.setTime(d.getTime() + 0);
      cookies.set("user", "temp", { path: "/", expires: d });
      console.log(cookies.getAll());
      navigate("/");
    });
  };

  const handleRegister = async () => {
    await axios.post(`${API}/users/signup`, {
      username: rUsername,
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
};

export default Auth;
