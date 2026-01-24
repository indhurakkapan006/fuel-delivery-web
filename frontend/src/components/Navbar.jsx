import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert("Logged out successfully");
    navigate('/auth');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>⛽ FuelGo</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/cart" style={styles.link}>Cart</Link>
        <Link to="/orders" style={styles.link}>Orders</Link>
        {token ? (
          <>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/auth" style={styles.link}>Login/Signup</Link>
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
    padding: '1rem 10%',
    backgroundColor: '#000',
    color: '#fff',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 15px',
    borderRadius: '5px',
    transition: '0.3s'
  }
};

export default Navbar;