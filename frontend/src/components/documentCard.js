import React from "react";
import { Link } from "react-router-dom";

const DocumentCard = (props) => {
  const title = props.title ? props.title : "Document Title";
  const author = props.author ? props.author : "anonymous";
  const created = props.created ? props.created : "2020-01-01";

  return (
    <tr>
      <Link to={`/documents/${props.id}`}>
        <td>{title}</td>
        <td>{author}</td>
        <td>{created}</td>
      </Link>
    </tr>
  );
};

export default DocumentCard;
