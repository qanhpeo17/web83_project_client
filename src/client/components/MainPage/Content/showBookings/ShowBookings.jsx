import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./showBookings.css";

function ShowBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [fieldDetails, setFieldDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");
  const userData = JSON.parse(atob(token.split(".")[1]));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9009/api/v1/booking/user/${userData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data.bookings);

        // Fetch field details for each booking
        const fieldDataPromises = response.data.bookings.map(
          async (booking) => {
            const fieldTypeResponse = await axios.get(
              `http://localhost:9009/api/v1/field/${booking.field}`
            );
            const fieldChildResponse = await axios.get(
              `http://localhost:9009/api/v1/field/getchild/${booking.fieldChild}`
            );
            return {
              [booking._id]: {
                fieldType: fieldTypeResponse.data.name,
                fieldChild: fieldChildResponse.data.childField.name,
              },
            };
          }
        );

        const fieldDataResults = await Promise.all(fieldDataPromises);
        const details = Object.assign({}, ...fieldDataResults);
        setFieldDetails(details);
      } catch (error) {
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userData.id, token]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:9009/api/v1/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      alert("Xóa lịch đặt thành công");
    } catch {
      setError("Có lỗi khi xóa lịch đặt.");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{`Lỗi: ${error}`}</div>;

  return (
    <div className="tableWrapper">
      <table className="bookingsTable">
        <thead>
          <tr>
            <th>Sân con</th>
            <th>Loại sân</th>
            <th>Giờ thuê</th>
            <th>Ngày thuê</th>
            <th>Trọng tài</th>
            <th>Bóng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  {fieldDetails[booking._id]?.fieldChild || "Đang tải..."}
                </td>
                <td>{fieldDetails[booking._id]?.fieldType || "Đang tải..."}</td>
                <td>{moment(booking.rentalTime).format("HH:mm")}</td>
                <td>{moment(booking.rentalDate).format("DD/MM/yyyy")}</td>
                <td>{booking.referee ? "Có" : "Không"}</td>
                <td>{booking.ball === 1 ? "Banh size 4" : "Banh size 5"}</td>
                <td>
                  <button onClick={() => handleDeleteBooking(booking._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Bạn chưa đặt sân.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShowBookings;
