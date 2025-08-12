import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import "../index.css"; // Ensure styles are applied

const AccessibilityToggle = () => {
  const { highContrast, toggleContrast } = useAccessibility();
  return (
    <button className="contrast-btn" onClick={toggleContrast}>
      {highContrast ? "Normal View" : "High Contrast"}
    </button>
  );
};

export default AccessibilityToggle;
