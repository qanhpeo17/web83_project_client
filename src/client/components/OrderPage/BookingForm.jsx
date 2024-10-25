import React, { useState, useEffect } from "react";
import "./BookingForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
function BookingForm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  // const currDate = moment().date;
  // const currTime = moment().hours;

  const [formData, setFormData] = useState({
    phone: "",
    fieldId: "6707ea59cacb858f48b1973e", // Field mặc định
    fieldChildId: "",
    rentalDate: "",
    rentalTime: "",
    referee: false,
    ball: 1,
  });

  const [fieldChildren, setFieldChildren] = useState([]); // Lưu trữ danh sách sân con
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
        console.log("Dữ liệu sân con:", response.data); // Kiểm tra dữ liệu trả về từ API

        // Truy cập đúng vào mảng childFields
        if (
          response.data.childFields &&
          Array.isArray(response.data.childFields)
        ) {
          setFieldChildren(response.data.childFields); // Đặt mảng sân con
        } else {
          setFieldChildren([]); // Nếu không phải mảng, đặt về mảng rỗng
        }
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy sân con:", error);
        setFieldChildren([]); // Đảm bảo fieldChildren là mảng rỗng nếu xảy ra lỗi
      });
  };

  // Tự động load sân con dựa vào fieldId mặc định khi component mount
  useEffect(() => {
    fetchFieldChildren(formData.fieldId);
  }, []);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Nếu người dùng thay đổi loại sân, gọi hàm để lấy danh sách sân con
    if (name === "fieldId") {
      fetchFieldChildren(value);
    }
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidDate(formData.rentalDate)) {
      alert("Ngay thue phai tu hien tai tro di");
      return;
    }
    if (!isValidTime(formData.rentalDate, formData.rentalTime)) {
      alert("Gio thue phai tu hien tai tro di");
      return;
    }
    // Kiểm tra token từ localStorage
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Bạn cần đăng nhập để đặt sân.");
      return;
    }

    axios
      .post("http://localhost:9009/api/v1/booking/", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Đảm bảo token được gửi trong headers
        },
      })
      .then((response) => {
        console.log("Response từ server:", response.data);
        alert("Đặt sân thành công!");
        navigate("/MainPage"); // Điều hướng sau khi đặt sân thành công
      })
      .catch((error) => {
        console.error("Có lỗi khi gửi request:", error);
        setError("Có lỗi xảy ra khi gửi form.");
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
            {Array.isArray(fieldChildren) && fieldChildren.length > 0 ? (
              fieldChildren.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))
            ) : (
              <option value="">Đang tải...</option>
            )}
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="rentalDate">Ngày thuê</label>
          <input
            type="date"
            id="rentalDate"
            name="rentalDate"
            value={formData.rentalDate}
            // value={currDate}
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
            //value={currTime}
            onChange={handleChange}
            required
          />
        </div>
        {/*  */}
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
