import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AccessibilityProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </AccessibilityProvider>
);