import React, { createContext, useState, useContext } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const toggleContrast = () => setHighContrast(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleContrast }}>
      <div style={{
        backgroundColor: highContrast ? '#000' : '#fff',
        color: highContrast ? '#fff' : '#000'
      }}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
