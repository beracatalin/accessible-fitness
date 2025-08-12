import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Remove if not using authentication context
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  // Remove or adjust useAuth if not using authentication context
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch {
      setError("Failed to create an account.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} aria-label="Registration form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input
          id="passwordConfirm"
          type="password"
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <div aria-live="assertive" className="register-error">
          {error}
        </div>
      </form>
    </div>
  );
};

export default Register;
