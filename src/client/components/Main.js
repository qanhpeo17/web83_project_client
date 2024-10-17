import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const Main = () => {
  return (
    <div>
      <h1>Welcome to the Main Page!</h1>
      <p>This is the main content area after logging in.</p>
    </div>
  );
};

export default Main;
