import React, { useState } from 'react';
import { signupUser, loginUser } from '../api';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await loginUser({ email: formData.email, password: formData.password });

        // Save user data for orders and session management
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('username', res.data.username);

        alert("Welcome back, " + res.data.username + "!");
        navigate('/');
      } else {
        // --- SIGNUP LOGIC ---
        const res = await signupUser(formData);
        alert(res.data.message || "Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Auth error. Check your backend server.';

      if (status === 400) {
        if (serverMsg.toLowerCase().includes('email')) {
          setError('This email is already registered. Try logging in or use a different email.');
        } else if (serverMsg.toLowerCase().includes('wrong password')) {
          setError('Incorrect password. Try again or reset your password.');
        } else if (serverMsg.toLowerCase().includes('invalid user')) {
          setError('No account found with this email. Please sign up.');
        } else {
          setError(serverMsg);
        }
      } else {
        setError(serverMsg);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div className="card" style={styles.authCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Login to manage your fuel deliveries' : 'Sign up to start ordering fuel today'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#ffe6e6', color: '#a00', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                placeholder="your name" 
                required
                onChange={(e) => { setFormData({...formData, username: e.target.value}); setError(''); }} 
                style={styles.input}
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required
              onChange={(e) => { setFormData({...formData, email: e.target.value}); setError(''); }} 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="" 
              required
              onChange={(e) => { setFormData({...formData, password: e.target.value}); setError(''); }} 
              style={styles.input}
            />
          </div>

          {!isLogin && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="+91 9876543210" 
                  onChange={(e) => { setFormData({...formData, phone: e.target.value}); setError(''); }} 
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Delivery Address (Optional)</label>
                <textarea 
                  placeholder="Enter your full delivery address" 
                  onChange={(e) => { setFormData({...formData, address: e.target.value}); setError(''); }} 
                  style={{...styles.input, height: '80px', resize: 'vertical'}}
                />
              </div>
            </>
          )}
          
          <button type="submit" style={styles.submitBtn}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"} 
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.toggleLink}>
              {isLogin ? ' Sign up now' : ' Log in here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '85vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px'
  },
  authCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    backgroundColor: '#fff',
    borderTop: '5px solid #ffc107' // Fuel Yellow Accent
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '1.8rem', color: '#2c3e50', margin: '0 0 10px 0' },
  subtitle: { color: '#7f8c8d', fontSize: '0.95rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#34495e' },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  submitBtn: {
    padding: '14px',
    background: '#ffc107',
    color: '#000',
    border: 'none',
    fontSize: '1rem',
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  footer: { marginTop: '25px', textAlign: 'center' },
  toggleText: { fontSize: '0.9rem', color: '#7f8c8d' },
  toggleLink: { color: '#ffc107', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }
};

export default Auth;