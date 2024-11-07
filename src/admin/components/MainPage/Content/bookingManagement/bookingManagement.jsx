import React, { useState, useEffect } from "react";
import "./bookingManagement.css";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function BookingManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10; // Số bookings hiển thị trên mỗi trang
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:9009/api/v1/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi lấy dữ liệu từ server.");
        }
        const data = await response.json();
        setData(data.bookings);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = data.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:9009/api/v1/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      alert("Xóa lịch đặt thành công");
    } catch {
      setError("Có lỗi khi xóa lịch đặt.");
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

  return (
    <div className="tableWrapper">
      <div className="menu">
        <a href="/admin-booking-management" style={{ background: "#00000093" }}>
          Quản lý lịch đặt sân
        </a>
        <a href="/admin-user-management">Quản lý tài khoản</a>
        <button className="logoutBtn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
      <table
        border="1"
        style={{
          width: "100vw",
          borderCollapse: "",
          backgroundColor: "#000",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>SDT</th>
            <th>Sân</th>
            <th>Loại Sân</th>
            <th>Giờ Thuê</th>
            <th>Ngày Thuê</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.length > 0 ? (
            currentBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.phone || "Đang tải..."}</td>
                <td>{booking.fieldChild || "Đang tải..."}</td>
                <td>{booking.field.name || "Đang tải..."}</td>
                <td>{booking.rentalTime}</td>
                <td>{moment(booking.rentalDate).format("DD/MM/yyyy")}</td>
                <td>
                  <button
                    style={{
                      width: "6rem",
                      height: "2rem",
                      padding: "1rem 2rem",
                      textAlign: "center",
                    }}
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ color: "#fff" }}>
                Chưa có lịch
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastBooking >= data.length}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default BookingManagement;
