import React, { useState } from 'react';
import './navbar.css';

const Navbar = ({ onLogoClick, isPaidUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (section, e) => {
    setIsMobileMenuOpen(false);
    // Handle navigation based on section
    if (section === 'home') {
      e.preventDefault();
      window.location.href = '/';
    }
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo" onClick={onLogoClick}>
          <span className="logo-text">Stocklele</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a href="/" className="navbar-link" onClick={(e) => handleNavClick('home', e)}>
              <span className="nav-icon">🏠</span>
              Home
            </a>
          </li>
          <li className="navbar-item">
            <a href="#industries" className="navbar-link">
              <span className="nav-icon">📊</span>
              Industries
            </a>
          </li>
          <li className="navbar-item">
            <a href="#earnings" className="navbar-link">
              <span className="nav-icon">📅</span>
              Earnings
            </a>
          </li>
          {isPaidUser && (
            <li className="navbar-item">
              <span className="navbar-badge pro-badge">
                <span className="badge-icon">👑</span>
                Premium
              </span>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger Menu */}
        <button
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
