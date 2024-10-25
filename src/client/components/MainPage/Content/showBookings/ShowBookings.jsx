import React from "react";
import "./showBookings.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";
function ShowBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [fieldType, setFieldType] = useState([]);
  const [fieldChild, setFieldChild] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");
  const decodeToken = (token) => {
    const base64Url = token.split(".")[1]; // Lay payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };
  const userData = decodeToken(token);
  console.log(userData);
  //

  //
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:9009/api/v1/booking/user/${userData.id}`,
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
        setBookings(data.bookings);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    console.log(bookings);
    fetchBookings();
  }, []);
  useEffect(() => {
    if (bookings.length > 0) {
      //
      const fetchFieldDetails = async () => {
        try {
          const fieldTypeResponse = await fetch(
            `http://localhost:9009/api/v1/field/${bookings[0].field}`
          );
          if (!fieldTypeResponse.ok) {
            throw new Error("Có lỗi xảy ra khi lấy field type.");
          }
          const fieldTypeData = await fieldTypeResponse.json();
          console.log(fieldTypeData.name);
          setFieldType(fieldTypeData.name);

          const fieldChildResponse = await fetch(
            `http://localhost:9009/api/v1/field/getchild/${bookings[0].fieldChild}`
          );
          if (!fieldChildResponse.ok) {
            throw new Error("Có lỗi xảy ra khi lấy field child.");
          }
          const fieldChildData = await fieldChildResponse.json();
          setFieldChild(fieldChildData.childField);
        } catch (error) {
          setError(error.message);
        }
        setLoading(false);
      };
      // console.log(fieldType);
      // console.log(fieldChild);
      fetchFieldDetails();
    }
  }, [bookings]);

  const handleDeleteBooking = async (bookingId) => {
    axios
      .delete(`http://localhost:9009/api/v1/booking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response từ server:", response.data);
        alert("Xoá sân thành công");
        navigate("/MainPage");
      })
      .catch((error) => {
        console.log("Có lỗi khi gửi request:", error);
        setError("Có lỗi khi xóa lịch đặt");
      });
  };
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{`Lỗi: ${error}`}</div>;
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
            <th>Sân</th>
            <th>Loại Sân</th>
            <th>Giờ Thuê</th>
            <th>Ngày Thuê</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <tr key={index}>
                <td>{fieldChild ? fieldChild.name : "Đang tải..."}</td>
                <td>{fieldType || "Đang tải..."}</td>
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
              <td colSpan="4" style={{ color: "#fff" }}>
                Bạn chưa đặt sân
                <br />
                <button
                  style={{
                    width: "6rem",
                    height: "2rem",
                    padding: "1rem 0 2rem",
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                  onClick={() => navigate("/booking")}
                >
                  Đặt sân
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShowBookings;
