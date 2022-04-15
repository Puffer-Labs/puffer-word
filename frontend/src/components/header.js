import React from "react";
import "./componentStyles/header.css";

const Header = (props) => {
  return (
    <div className="header">
      <h1>Puffer-Word</h1>
      <input type="text" placeholder="Search" />
    </div>
  );
};

export default Header;
