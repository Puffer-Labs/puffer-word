import React, { useEffect, useState } from "react";
import axios from 'axios'
import {withCookies, Cookies} from "react-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies()

const Documents = () => {
const navigate = useNavigate();


    //dummy docs - replace with API GET endpoint
const docs = ['document1', 'document2', 'document3'];
const handleLogout = () => {
    axios.get("http://localhost:8080/logout")
     .then(res => {
       let d = new Date();
       d.setTime(d.getTime() + 0);
       cookies.set('user', 'temp', {path: "/", expires: d})
       console.log(cookies.getAll())
       navigate('/');
   }) 
}

const documentMapping = docs.map((document, index) => 
    <a href='#' key={index + document} >{document} </a>
);
    return(
        
        <div>
            {documentMapping}
            <button onClick={() => handleLogout()}>Logout</button>

        </div>
    )

}

export default Documents