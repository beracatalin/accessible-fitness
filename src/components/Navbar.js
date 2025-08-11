import React from 'react';
import { Link } from 'react-router-dom';
import AccessibilityToggle from './AccessibilityToggle';
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/workouts">Workouts</Link>
        <Link to="/wellness">Wellness</Link>
        <Link to="/register">Register</Link> {/* Added Register */}
        <Link to="/login">Login</Link>       {/* Added Login */}
      </div>
      <AccessibilityToggle />
    </nav>
  );
};

export default Navbar;
