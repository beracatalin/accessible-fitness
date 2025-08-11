import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityToggle = () => {
  const { highContrast, toggleContrast } = useAccessibility();
  return (
    <button onClick={toggleContrast} style={{ padding: '0.5rem', background: '#fff', border: '1px solid #000' }}>
      {highContrast ? 'Normal View' : 'High Contrast'}
    </button>
  );
};

export default AccessibilityToggle;
