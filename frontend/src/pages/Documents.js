import React, { useEffect, useState } from "react";
import axios from "axios";
import { withCookies, Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DocumentList from "../components/documentList";
import "./pageStyles/documents.css";
import { API } from "../constants";

/**
 * TODO: replace dummy data with API GET endpoint
 */

const cookies = new Cookies();

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/collection/list`, { withCredentials: true })
      .then((res) => setDocuments(res.data));
  }, []);

  const handleLogout = () => {
    axios
      .get(`${API}/users/logout`, { withCredentials: true })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    let d = new Date();
    d.setTime(d.getTime() + 0);
    cookies.set("user", "temp", { path: "/", expires: d });
    navigate("/login");
  };

  return (
    <div id="home">
      <Header />
      <DocumentList documents={documents} />
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
};

export default Documents;
