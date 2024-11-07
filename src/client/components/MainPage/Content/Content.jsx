import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Import biểu đồ cột từ react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./Content.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Content() {
  const [data, setData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy thông tin sân
  useEffect(() => {
    axios
      .get("http://localhost:9009/api/v1/field")
      .then((response) => {
        if (Array.isArray(response.data.fields)) {
          setData(response.data.fields);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("There was an error fetching the data!");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please log in to view weekly bookings.");
      return;
    }
    axios
      .get("http://localhost:9009/api/v1/booking/weekly-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings || []);
        processChartData(response.data.bookings || []);
      })
      .catch((error) => {
        console.error("Error fetching weekly bookings:", error);
        setError("Error fetching weekly bookings.");
      });
  }, []);
  const processChartData = (bookings) => {
    const daysOfWeek = [
      "Chủ nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const counts = Array(7).fill(0);

    bookings.forEach((booking) => {
      const day = new Date(booking.rentalDate).getDay();
      counts[day]++;
    });

    setChartData({
      labels: daysOfWeek,
      datasets: [
        {
          label: "Số lượng đặt sân",
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No data available</div>;

  return (
    <div>
      <div className="contentWrapper">
        {/* Bảng hiển thị lịch đặt trong tuần */}
        <div className="dashboardWrapper">
          <h2 style={{ color: "#fff" }}>Lịch đặt sân trong tuần</h2>
          <table className="dashboardTable">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Người dùng</th>
                <th>Sân</th>
                <th>Sân con</th>
                <th>Trọng tài</th>
                <th>Banh</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{new Date(booking.rentalDate).toLocaleDateString()}</td>
                    <td>{new Date(booking.rentalTime).toLocaleTimeString()}</td>
                    <td>{booking.user?.name || "N/A"}</td>
                    <td>{booking.field?.name || "N/A"}</td>
                    <td>
                      {booking.fieldChild ? booking.fieldChild.name : "N/A"}
                    </td>
                    <td>{booking.referee ? "Có" : "Không"}</td>
                    <td>{booking.ball === 1 ? "Size 4" : "Size 5"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Hiện tại chưa có lịch đặt nào trong tuần</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Trang sau
            </button>
          </div>
        </div>
        <div className="fieldtypeList">
          {data.map((item) => (
            <div
              key={item._id}
              className="field field1"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${
                  item.image ? item.image : "/path/to/default-image.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p>{item.name}</p>
              <p>
                <strong>{item.quantity}</strong> sân
              </p>
              <a href="/booking" className="orderBtn">
                Đặt sân
              </a>
            </div>
          ))}
        </div>
        {chartData && (
          <div className="chartWrapper">
            <h2>Thống kê số lượng đặt sân trong tuần</h2>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
