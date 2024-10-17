import logo from "./logo.svg";
import "./App.css";
import MainPage from "./client/screens/MainPage.jsx";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FormContainer from "./client/components/FormContainer.js";
import ToggleContainer from "./client/components/ToggleContainer.js";
import BookingPage from "./client/screens/BookingPage.jsx";
import axios from "axios";

const App = () => {
  const [credentials, setCredentials] = useState({});
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Cấu hình Axios mặc định để thêm token vào tất cả các yêu cầu
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setIsAuthenticated(true);
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   }
  // }, []);

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  // Lưu token vào localStorage khi đăng nhập thành công
  const handleLoginSuccess = (token) => {
    localStorage.setItem("access_token", token); // Lưu access token
    setIsAuthenticated(true); // Đánh dấu người dùng đã đăng nhập
  };

  // Kiểm tra token khi ứng dụng khởi động
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     setIsAuthenticated(true);
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   }
  // }, []);
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Lấy token từ localStorage
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Thiết lập token vào headers của axios
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:9009/api/v1/auth/login",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching protected data", error);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:9009/api/v1/auth/register",
        { username, password }
      );
      if (response.status === 201) {
        const token = response.data.token;
        handleLoginSuccess(token);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  const handleLogout = async () => {
    const rt = await localStorage.getItem("refresh_token");
    const response = await axios.post(
      "http://localhost:9009/api/v1/auth/logout",
      { rt }
    );
    if (response.status === 201) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };
  // const handleLogin = async (email, password) => {
  // try {
  //   const response = await axios.post(
  //     "http://localhost:9009/api/v1/auth/login",
  //     {
  //       email,
  //       password,
  //     }
  //   );
  //   if (response.status === 200) {
  //     const token = response.data.access_token;
  //     handleLoginSuccess(token);
  //   }
  // } catch (error) {
  //   console.error("Login failed:", error);
  // }

  //};
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
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <div
              className={`container ${isSignUpActive ? "active" : ""}`}
              id="container"
            >
              <FormContainer
                formType="sign-in"
                handleLogin={handleLogin}
                handleLoginSuccess={handleLoginSuccess}
              />
              <ToggleContainer
                onSignInClick={handleSignInClick}
                onSignUpClick={handleSignUpClick}
              />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div
              className={`container ${isSignUpActive ? "active" : ""}`}
              id="container"
            >
              <FormContainer
                formType="sign-up"
                handleRegister={handleRegister}
                handleLoginSuccess={handleLoginSuccess}
              />
              <ToggleContainer
                onSignInClick={handleSignInClick}
                onSignUpClick={handleSignUpClick}
              />
            </div>
          }
        />
        <Route
          path="/MainPage"
          element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}
        />

        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
