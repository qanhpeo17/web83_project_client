import React, { useState } from "react";
import {
  validateRequired,
  validateEmail,
  validatePassword,
} from "./Validations.js";
import SocialIcons from "./SocialIcons.js";
import { useNavigate } from "react-router-dom";

const Form = ({
  title,
  buttonText,
  spanText,
  linkText,
  linkHref,
  handleLoginSuccess,
  formType,
  toggleFormType,
}) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (formType === "sign-up" && !validateRequired(values.name)) {
      newErrors.name = "Name is required";
    }
    if (!validateEmail(values.email)) {
      newErrors.email = "Email is invalid";
    }
    // if (!validatePassword(values.password)) {
    //   newErrors.password =
    //     "Password must be at least 8 characters long and include a number and a special character";
    // }
    if (formType === "sign-up" && values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:9009/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        // Lưu access token và refresh token vào localStorage
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("refresh_token", result.refresh_token);
        localStorage.setItem("user", result.userInfo);
        // Gọi hàm handleLoginSuccess
        handleLoginSuccess(result.access_token);

        // Điều hướng đến trang chính
        navigate("/MainPage");
      } else {
        const errorResult = await response.json();
        console.error("Login error:", errorResult.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const endpoint =
          formType === "sign-up"
            ? "http://localhost:9009/api/v1/auth/register"
            : "http://localhost:9009/api/v1/auth/login";

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Form submitted successfully:", result);
          if (formType === "sign-in") {
            localStorage.setItem("access_token", result.access_token);
            localStorage.setItem("refresh_token", result.refresh_token);
            // localStorage.setItem("user", result.userInfo);
            handleLoginSuccess(result.access_token); // Truyền token tới handleLoginSuccess
            navigate("/MainPage"); // Điều hướng đến trang chính
          } else {
            // Sau khi đăng ký thành công, chuyển đến form đăng nhập
            toggleFormType("sign-in");
            await handleSubmitLogin(result.email, values.password);
          }
        } else {
          const errorResult = await response.json();
          console.error("Form submission error:", errorResult.message);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     try {
  //       const endpoint =
  //         formType === "sign-up"
  //           ? "http://localhost:9009/api/v1/auth/register"
  //           : "http://localhost:9009/api/v1/auth/login";
  //       const response = await fetch(endpoint, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(values),
  //       });
  //       if (response.ok) {
  //         const result = await response.json();
  //         console.log("Form submitted successfully:", result);
  //         if (formType === "sign-in") {
  //           handleLoginSuccess(result.token); // Pass the token to handleLoginSuccess
  //           navigate("/MainPage"); // Redirect to the main page
  //         } else {
  //           // Successful registration, switch to login form
  //           toggleFormType("sign-in");
  //           await handleSubmitLogin(result.email, values.password);
  //         }
  //       } else {
  //         const errorResult = await response.json();
  //         console.error("Form submission error:", errorResult.message);
  //       }
  //     } catch (error) {
  //       console.error("Form submission error:", error);
  //     }
  //   }
  // };

  // const handleSubmitLogin = async (email, password) => {
  //   try {
  //     const response = await fetch("http://localhost:9009/api/v1/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });
  //     if (response.ok) {
  //       const result = await response.json();
  //       localStorage.setItem("token", result.token);
  //       handleLoginSuccess();
  //       navigate("/MainPage"); // Chuyển hướng đến trang chính sau khi đăng nhập thành công
  //     } else {
  //       const errorResult = await response.json();
  //       console.error("Login error:", errorResult.message);
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>
      <SocialIcons />
      {formType === "sign-up" && (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={values.name || ""}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
      )}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email || ""}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={values.password || ""}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      {formType === "sign-up" && (
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={values.confirmPassword || ""}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
      )}
      {spanText && <span>{spanText}</span>}
      {linkText && linkHref && <a href={linkHref}>{linkText}</a>}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default Form;
