import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ handleLoginSuccess }) => {
  const [credentials, setCredentials] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here, set authentication state
    handleLoginSuccess();
    navigate("/main"); // Redirect to main page on successful login
  };
  const handleLogin = () => {
    fetch("http://localhost:9009/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form /* onSubmit={handleSubmit}*/>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        //onChange={handleChange()}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        //onChange={handleChange()}
      />
      <button /*type="submit"*/ onClick={handleLogin()}>Login</button>
    </form>
  );
};

export default Login;
