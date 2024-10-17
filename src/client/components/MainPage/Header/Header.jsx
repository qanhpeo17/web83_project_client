import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../Header/media/_04c119b2-de57-4187-84b0-83957ad645f2.jfif";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = async () => {
    console.log("handleLogout duoc goi");
    const token = await localStorage.getItem("access_token");
    const rt = await localStorage.getItem("refresh_token");
    console.log("token:", token);
    console.log("rf-token:", rt);
    await axios.post(
      "http://localhost:9009/api/v1/auth/logout",
      { refreshToken: rt },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: rt,
      }
    );
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/login");
  };
  return (
    <header className="header">
      <div className="logo">
        <Link to="/MainPage" style={{ height: "100%" }}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navigation-header">
        {isAuthenticated ? ( // Kiểm tra nếu người dùng đã đăng nhập
          <div className="userInfo">
            {/* <span>Xin chào, {user.name}</span>  Hiển thị tên người dùng */}
            <button className="logoutBtn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="authLinks">
            <Link to="/login">Đăng nhập</Link>
            <label htmlFor="">/</label>
            <Link to="/register">Đăng ký</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
