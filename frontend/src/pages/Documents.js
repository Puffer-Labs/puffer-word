import React, { useEffect, useState } from "react";
import axios from "axios";
import { withCookies, Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DocumentList from "../components/documentList";
import "./pageStyles/documents.css";

const cookies = new Cookies();

const Documents = () => {
  const navigate = useNavigate();

  //dummy docs - replace with API GET endpoint
  const docs = [
    {
      title: "Document 1",
      author: "Author 1",
      id: 1,
      created: "2020-01-01",
    },
    {
      title: "Document 2",
      author: "Author 2",
      id: 2,
      created: "2020-02-01",
    },
    {
      title: "Document 3",
      author: "Author 3",
      id: 3,
      created: "2020-03-01",
    },
  ];

  const handleLogout = () => {
    axios
      .get("http://localhost:8080/logout")
      .then((res) => {
        let d = new Date();
        d.setTime(d.getTime() + 0);
        cookies.set("user", "temp", { path: "/", expires: d });
        console.log(cookies.getAll());
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        navigate("/login"); //logout sends an error but still logs out????
      });
  };

  return (
    <div id="home">
      <Header />
      <DocumentList documents={docs} />
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
};

export default Documents;
