import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/EmailConfirmation.css";

const EmailConfirmation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { confirmEmail } = useAuth();

  const [status, setStatus] = useState("confirming"); // 'confirming', 'success', 'error'
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleConfirmation = async () => {
      if (!token) {
        setStatus("error");
        setError("Invalid confirmation link");
        return;
      }

      try {
        const result = await confirmEmail(token);
        setStatus("success");
        setMessage(result.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setError(err.message || "Email confirmation failed");
      }
    };

    handleConfirmation();
  }, [token, confirmEmail, navigate]);

  return (
    <main className="email-confirmation-container" role="main">
      <div className="confirmation-card">
        {status === "confirming" && (
          <div className="confirmation-status" aria-live="polite">
            <div
              className="loading-spinner"
              aria-label="Confirming email"
            ></div>
            <h2>Confirming Your Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="confirmation-status success" aria-live="polite">
            <div className="success-icon" aria-hidden="true">
              ✓
            </div>
            <h2>Email Confirmed Successfully!</h2>
            <p>{message}</p>
            <p>You will be redirected to the login page in a few seconds.</p>
            <Link to="/login" className="login-link">
              Go to Login Now
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="confirmation-status error" aria-live="assertive">
            <div className="error-icon" aria-hidden="true">
              ✗
            </div>
            <h2>Email Confirmation Failed</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <Link to="/register" className="retry-link">
                Register Again
              </Link>
              <Link to="/login" className="login-link">
                Try to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default EmailConfirmation;
