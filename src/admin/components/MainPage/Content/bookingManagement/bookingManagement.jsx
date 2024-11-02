import React, { useState } from "react";
import "./bookingManagement.css";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
function BookingManagement() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
    console.log(data);
    fetchBookings();
  }, []);
  console.log("admin-bookings:", data);
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
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((booking, index) => (
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
                    // onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ color: "#fff" }}>
                Chua co lich
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookingManagement;
