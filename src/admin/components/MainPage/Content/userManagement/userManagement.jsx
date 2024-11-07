import React, { useEffect, useState } from "react";
import "./userManagement.css";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Change this to display more or fewer users per page
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError("Token is missing! Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:9009/api/v1/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi lấy dữ liệu từ server.");
        }
        const data = await response.json();
        setData(data.userList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const totalPages = Math.ceil(data.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:9009/api/v1/admin/delete-user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("Xóa người dùng thành công");
    } catch {
      setError("Có lỗi khi xóa người dùng.");
    }
  };
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="tableWrapper">
      <div className="menu">
        <a href="/admin-booking-management">Quản lý lịch đặt sân</a>
        <a href="/admin-user-management" style={{ background: "#00000093" }}>
          Quản lý tài khoản
        </a>
        <button className="logoutBtn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
      <table className="userTable">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name || "Đang tải..."}</td>
              <td>{user.email || "Đang tải..."}</td>
              <td>{user.role || "Đang tải..."}</td>
              <td>{moment(user.createdAt).format("DD/MM/yyyy")}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="deleteButton"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paginationControls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Trang trước
        </button>
        <span>{`Trang ${currentPage} của ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default UserManagement;
