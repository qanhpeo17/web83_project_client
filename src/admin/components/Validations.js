export const validateRequired = (value) => value.trim() !== "";
export const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
export const validatePassword = (value) => {
  const minLength = 8;
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  return value.length >= minLength && hasNumber && hasSpecialChar;
};
