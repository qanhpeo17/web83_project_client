import React, { useState } from "react";
import "./BookingForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookingForm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Sử dụng useNavigate để tạo hàm điều hướng

  const [formData, setFormData] = useState({
    phone: "",
    fieldId: "6707ea59cacb858f48b1973e",
    rentalDate: "",
    rentalTime: "",
    referee: false,
    ball: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit được gọi");
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");
    console.log("Token:", token);
    if (!token) {
      setError("Bạn cần đăng nhập để đặt sân.");
      return;
    }

    // Gửi form data kèm token
    axios
      .post("http://localhost:9009/api/v1/booking/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response từ server:", response.data);
        alert("Đặt sân thành công!");
        navigate("/MainPage");
      })
      .catch((error) => {
        console.error("Có lỗi khi gửi request:", error);
        setError("Có lỗi xảy ra khi gửi form.");
      });

    console.log("Form submitted:", formData);
  };

  return (
    <div className="formWrapper">
      <form className="bookingForm" onSubmit={handleSubmit}>
        <h2>Đặt Sân Bóng</h2>

        <div className="formGroup">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="fieldType">Loại sân</label>
          <select
            id="fieldType"
            name="fieldId"
            value={formData.fieldId}
            onChange={handleChange}
          >
            <option value="6707ea59cacb858f48b1973e">Sân 5</option>
            <option value="6707ea97cacb858f48b19740">Sân 7</option>
            <option value="6707eaafcacb858f48b19742">Sân 11</option>
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="rentalDate">Ngày thuê</label>
          <input
            type="date"
            id="rentalDate"
            name="rentalDate"
            value={formData.rentalDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="rentalTime">Giờ thuê</label>
          <input
            type="time"
            id="rentalTime"
            name="rentalTime"
            value={formData.rentalTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label>
            <input
              type="checkbox"
              name="referee"
              checked={formData.referee}
              onChange={handleChange}
            />
            Trọng tài
          </label>
        </div>

        <div className="formGroup">
          <label htmlFor="ball">Banh</label>
          <select
            id="ball"
            name="ball"
            value={formData.ball}
            onChange={handleChange}
          >
            <option value="1">Banh size 4</option>
            <option value="2">Banh size 5</option>
          </select>
        </div>

        <button type="submit">Đặt sân</button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default BookingForm;
