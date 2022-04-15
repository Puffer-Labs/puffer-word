import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../constants";

const DocumentCard = (props) => {
  return (
    <tr>
      <td>{props.id}</td>
      <td>
        <Link to={`/doc/edit/${props.id}`}>{props.name}</Link>
      </td>
      <td
        onClick={() => {
          axios
            .post(
              `${API}/collection/delete`,
              {
                docid: props.id,
              },
              { withCredentials: true }
            )
            .then((res) => window.location.reload());
        }}
      >
        Delete
      </td>
    </tr>
  );
};

export default DocumentCard;
