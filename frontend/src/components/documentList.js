import axios from "axios";
import React, { useState } from "react";
import "./componentStyles/documentList.css";
import DocumentCard from "./documentCard";
import { API } from "../constants";
import { useNavigate } from "react-router-dom";

const DocumentList = (props) => {
  const [name, setName] = useState("");
  const documents = props.documents;
  const navigate = useNavigate();

  const mapDocs = documents.map((document) => (
    <DocumentCard name={document.name} key={document.id} id={document.id} />
  ));

  const handleNewDocument = () => {
    axios
      .post(
        `${API}/collection/create`,
        {
          name: name,
        },
        { withCredentials: true }
      )
      .then((res) => window.location.reload());
  };

  return (
    <div className="doc-list-element">
      <div className="list-banner">
        <h1>Documents</h1>
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="new-doc-btn" onClick={handleNewDocument}>
          New Document
        </button>
      </div>
      <div className="document-table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{mapDocs}</tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;
