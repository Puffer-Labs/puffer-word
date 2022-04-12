import React, { useEffect, useState } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rUsername, setRUsername] = useState('');
    const [rPassword, setRPassword] = useState('');

    useEffect(() => {
    })

    function loginHandler() {
        //Handle authentication
        console.log(username, password)

        //If succesfull -> switch to display all documents


        //Else display error message on screen

    }

    function registerHandler(){
        //Handle registration

    }

    return (
        <div>
            <div>
                Login
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}></input>
                <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
                <button onClick={() => loginHandler()}>Login</button>
            </div>
            <div>
                Register
                <input placeholder="Username" value={rUsername} onChange={e => setRUsername(e.target.value)}></input>
                <input placeholder="Password" value={rPassword} onChange={e => setRPassword(e.target.value)}></input>
                <button  onClick={() => registerHandler()}>Register</button>
            </div>
        </div>
    )
}

export default Login;