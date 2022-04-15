import React from "react";
import "./componentStyles/documentList.css";
import DocumentCard from "./documentCard";

const DocumentList = (props) => {
  const documents = props.documents;

  const mapDocs = documents.map((document) => (
    <DocumentCard
      title={document.title}
      author={document.author}
      created={document.created}
      key={document.id}
      id={document.id}
    />
  ));

  return (
    <div className="doc-list-element">
      <div className="list-banner">
        <h1>Documents</h1>
        <button className="new-doc-btn">New Document</button>
      </div>
      <div className="document-table-container">
        <table className="table">
          <tr className="table-header">
            <th>Name</th>
            <th>Author</th>
            <th>Created Date</th>
          </tr>
          {mapDocs}
        </table>
      </div>
    </div>
  );
};

export default DocumentList;
