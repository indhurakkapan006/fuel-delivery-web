import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', phone: '', address: '' });
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      console.log('Fetching profile for email:', email);
      getProfile(email)
        .then(res => {
          console.log('Profile data received:', res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.error('Profile fetch error:', err);
          if (err.response?.status === 404) {
            alert('User profile not found. Please try logging in again.');
          }
        });
    } else {
      console.log('No email found in localStorage');
    }
  }, [email]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ 
        email: user.email, 
        username: user.username, 
        phone: user.phone, 
        address: user.address 
      });
      alert("Profile updated successfully!");
    } catch (err) {
      if (err.response?.status === 403) {
        // Token is invalid/expired, clear it and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        alert("Your session has expired. Please login again.");
        navigate('/auth');
      } else {
        alert(`Update failed: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>My Profile</h2>
      
      {!email ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '5px' }}>
          <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>Not Logged In</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Please log in to view and edit your profile.</p>
          <button 
            onClick={() => navigate('/auth')}
            style={{ 
              padding: '10px 20px', 
              background: '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username</label>
            <input 
              type="text" 
              value={user.username || ''} 
              onChange={(e) => setUser({...user, username: e.target.value})} 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }} 
              placeholder="Enter username" 
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input 
              type="email" 
              value={user.email || ''} 
              onChange={(e) => setUser({...user, email: e.target.value})} 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }} 
              placeholder="Enter email" 
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
            <input 
              type="tel" 
              value={user.phone || ''} 
              onChange={(e) => setUser({...user, phone: e.target.value})} 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }} 
              placeholder="Enter phone number" 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Delivery Address</label>
            <textarea 
              value={user.address || ''} 
              onChange={(e) => setUser({...user, address: e.target.value})} 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', height: '100px', resize: 'vertical' }} 
              placeholder="Enter your full delivery address" 
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              padding: '15px', 
              background: 'linear-gradient(135deg, #28a745, #20c997)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: 'bold',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'linear-gradient(135deg, #218838, #1aa085)'}
            onMouseOut={(e) => e.target.style.background = 'linear-gradient(135deg, #28a745, #20c997)'}
          >
            Save Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;