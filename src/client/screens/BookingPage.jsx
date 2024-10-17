import React from "react";
import Header from "../components/MainPage/Header/Header.jsx";
import Hero from "../components/MainPage/Hero/Hero";
import BookingForm from "../components/OrderPage/BookingForm";
import Footer from "../components/Footer/Footer";
function bookingPage() {
  return (
    <div>
      <Header />
      <Hero></Hero>
      <BookingForm></BookingForm>
      <Footer></Footer>
    </div>
  );
}

export default bookingPage;
