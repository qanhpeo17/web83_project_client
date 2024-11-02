import React, { useEffect, useState } from "react";
import "./userManagement.css";
import moment from "moment";

function UserManagement() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#000",
          textAlign: "center",
        }}
      >
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
          {data.map((user, index) => (
            <tr key={index}>
              <td>{user.name || "Đang tải..."}</td>
              <td>{user.email || "Đang tải..."}</td>
              <td>{user.role || "Đang tải..."}</td>
              <td>{moment(user.createdAt).format("DD/MM/yyyy")}</td>
              <td>
                <button
                  style={{
                    width: "6rem",
                    height: "2rem",
                    padding: "1rem 2rem",
                    textAlign: "center",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
