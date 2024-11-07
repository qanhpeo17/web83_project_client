import React, { useState, useEffect } from "react";
import "./BookingForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import moment from "moment";
import moment from "moment-timezone";

function BookingForm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    fieldId: "6707ea59cacb858f48b1973e", // Default Field
    fieldChildId: "",
    rentalDate: "",
    rentalTime: "",
    referee: false,
    ball: 1,
  });

  const [fieldChildren, setFieldChildren] = useState([]);

  // Helper functions to validate date and time
  function isValidDate(rentalDate) {
    return moment(rentalDate).isSameOrAfter(moment(), "day");
  }

  function isValidTime(rentalDate, rentalTime) {
    const enteredDateTime = moment(`${rentalDate}T${rentalTime}`);
    return enteredDateTime.isSameOrAfter(moment());
  }

  const fetchFieldChildren = (fieldId) => {
    axios
      .get(`http://localhost:9009/api/v1/field/get-child/${fieldId}`)
      .then((response) => {
        setFieldChildren(response.data.childFields || []);
      })
      .catch((error) => {
        console.error("Error fetching child fields:", error);
        setFieldChildren([]);
      });
  };

  useEffect(() => {
    fetchFieldChildren(formData.fieldId);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "fieldId") {
      fetchFieldChildren(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kết hợp rentalDate và rentalTime
    const localDateTime = moment(
      `${formData.rentalDate}T${formData.rentalTime}`
    );
    const adjustedDateTime = localDateTime.add(0, "hours").toISOString(); // Trừ đi 7 tiếng

    const formDataToSend = {
      ...formData,
      rentalTime: adjustedDateTime, // Gửi thời gian đã trừ đi 7 tiếng
    };
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Bạn cần đăng nhập để đặt sân.");
      return;
    }
    axios
      .post("http://localhost:9009/api/v1/booking/", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Booking successful:", response.data);
        alert("Đặt sân thành công!");
        navigate("/MainPage");
      })
      .catch((error) => {
        console.error("Error response from server:", error.response);
        if (error.response && error.response.status === 409) {
          alert("Giờ đặt sân bị trùng! Vui lòng chọn giờ khác.");
        } else {
          setError("Có lỗi xảy ra khi gửi form.");
        }
      });
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
            required
          >
            <option value="67120ec902410e0b4d4dd9dc">Sân 5</option>
            <option value="671210825a63618873f160c4">Sân 7</option>
            <option value="671210f05a63618873f160c6">Sân 11</option>
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="fieldChild">Sân con</label>
          <select
            id="fieldChild"
            name="fieldChildId"
            value={formData.fieldChildId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn sân con</option>
            {fieldChildren.map((child) => (
              <option key={child._id} value={child._id}>
                {child.name}
              </option>
            ))}
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
