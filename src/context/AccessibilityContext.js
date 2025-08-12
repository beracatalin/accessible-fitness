import React, { createContext, useContext, useState } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false);

  const toggleContrast = () => setHighContrast((prev) => !prev);

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleContrast }}>
      <div className={highContrast ? 'high-contrast' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

// Optional: HighContrastButton component
export function HighContrastButton() {
  const { highContrast, toggleContrast } = useAccessibility();

  return (
    <button className="contrast-btn" onClick={toggleContrast}>
      {highContrast ? "Normal Mode" : "High Contrast"}
    </button>
  );
}