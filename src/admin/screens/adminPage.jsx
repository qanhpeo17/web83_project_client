import React from "react";
import "./adminPage.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
function AdminPage() {
  return (
    <div className="AdminPageWrapper">
      <div className="menu">
        <a href="/admin-booking-management">Quản lý lịch đặt sân</a>
        <a href="/admin-user-management">Quản lý tài khoản</a>
      </div>
    </div>
  );
}

export default AdminPage;
