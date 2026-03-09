import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePopup } from '../contexts/PopupContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { showSuccess } = usePopup();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showSuccess('Logged Out', 'You have been logged out successfully.');
    navigate('/auth');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⛽</span>
        <Link to="/" style={{...styles.logo, textDecoration: 'none'}}>FuelGo</Link>
      </div>
      <div style={styles.links}>
        <Link
          to="/"
          style={styles.link}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.link)}
        >
          🏠 Home
        </Link>
        <Link
          to="/cart"
          style={styles.link}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.link)}
        >
          🛒 Cart
        </Link>
        <Link
          to="/orders"
          style={styles.link}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.link)}
        >
          📋 Orders
        </Link>
        {token ? (
          <>
            <Link
              to="/profile"
              style={styles.link}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.link)}
            >
              👤 Profile
            </Link>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.logoutBtnHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.logoutBtn)}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            style={styles.link}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.linkHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.link)}
          >
            🔐 Login/Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 8%',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  linkHover: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
  },
  logoutBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
  },
};

export default Navbar;