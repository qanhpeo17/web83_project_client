import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BookingManagement from "./bookingManagement/BookingManagement.jsx";
function Content() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <div
                className={`container ${isSignUpActive ? "active" : ""}`}
                id="container"
              >
                <FormContainer
                  formType="sign-in"
                  handleLogin={handleLogin}
                  handleLoginSuccess={handleLoginSuccess}
                />
                <ToggleContainer
                  onSignInClick={handleSignInClick}
                  onSignUpClick={handleSignUpClick}
                />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div
                className={`container ${isSignUpActive ? "active" : ""}`}
                id="container"
              >
                <FormContainer
                  formType="sign-up"
                  handleRegister={handleRegister}
                  handleLoginSuccess={handleLoginSuccess}
                />
                <ToggleContainer
                  onSignInClick={handleSignInClick}
                  onSignUpClick={handleSignUpClick}
                />
              </div>
            }
          />
          <Route path="/Admin-MainPage" element={<MainPage />} />

          <Route
            path="/Admin-Booking-Management"
            element={<BookingManagement />}
          />

          {/* <Route path="/Admin-User-Management" element={<ViewBookingPage />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default Content;
