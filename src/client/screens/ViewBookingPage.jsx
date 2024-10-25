import React from "react";
import Header from "../components/MainPage/Header/Header.jsx";
import ShowBookings from "../components/MainPage/Content/showBookings/ShowBookings.jsx";
import Footer from "../components/Footer/Footer.jsx";

function ViewBookingPage() {
  return (
    <div style={{ width: "100vw" }}>
      <Header />
      <ShowBookings />
      <Footer />
    </div>
  );
}

export default ViewBookingPage;
