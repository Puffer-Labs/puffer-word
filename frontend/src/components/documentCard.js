import React from "react";

const DocumentCard = (props) => {
  const title = props.title ? props.title : "Document Title";
  const author = props.author ? props.author : "anonymous";
  const created = props.created ? props.created : "2020-01-01";

  return (
    <tr>
      <td>{title}</td>
      <td>{author}</td>
      <td>{created}</td>
    </tr>
  );
};

export default DocumentCard;
