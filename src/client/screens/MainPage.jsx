import React from "react";
import Header from "../components/MainPage/Header/Header";
import Hero from "../components/MainPage/Hero/Hero";
import Body from "../components/MainPage/Body/Body";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";
const MainPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate(); // Sử dụng useNavigate để tạo hàm điều hướng

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      navigate("/login");
      return;
    }

    const fetchProtectedData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9009/api/v1/auth/protected-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Protected Data:", response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching protected data", error);
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    };

    fetchProtectedData();
  }, [navigate]);

  // Nếu chưa xác thực, không hiển thị MainPage cho đến khi kiểm tra xong
  if (!isAuthenticated) {
    return null; // Hoặc một loading spinner
  }

  return (
    <div>
      <Header />
      <Hero />
      <Body />
      <Footer />
    </div>
  );
};

export default MainPage;
