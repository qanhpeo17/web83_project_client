import React from "react";
import Form from "./Form.js";

const FormContainer = ({ formType, handleLoginSuccess, toggleFormType }) => {
  return (
    <div
      className={`formContainer ${formType === "sign-up" ? "active" : ""}`}
      id="container"
    >
      <div className="form-container sign-up">
        <Form
          title="Create Account"
          buttonText="Sign Up"
          spanText="or use your email for registration"
          handleLoginSuccess={handleLoginSuccess}
          formType="sign-up"
          toggleFormType={toggleFormType}
        />
      </div>
      <div className="form-container sign-in">
        <Form
          title="Sign In"
          buttonText="Sign In"
          spanText="or use your email password"
          linkText="Forget Your Password?"
          linkHref="#"
          handleLoginSuccess={handleLoginSuccess}
          formType="sign-in"
          toggleFormType={toggleFormType}
        />
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="ghost" onClick={() => toggleFormType("sign-in")}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <button className="ghost" onClick={() => toggleFormType("sign-up")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
