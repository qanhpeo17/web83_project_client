import React from "react";
import "./Body.css";
import Sidebar from "../Sidebar/Sidebar";
import Content from "../Content/Content";
function Body() {
  return (
    <div className="bodyWrapper">
      <Sidebar />
      <Content />
    </div>
  );
}

export default Body;
