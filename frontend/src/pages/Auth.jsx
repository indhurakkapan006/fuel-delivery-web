import React, { useState } from 'react';
import { signupUser, loginUser } from '../api';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await loginUser({ email: formData.email, password: formData.password });

        // Save user data for orders and session management
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('username', res.data.username);

        setSuccess(`Welcome back, ${res.data.username}! Redirecting you now…`);
        setTimeout(() => navigate('/'), 900);
      } else {
        // --- SIGNUP LOGIC ---
        const res = await signupUser(formData);
        const msg = res.data.message || "Account created successfully! Logging you in…";
        setSuccess(msg);
        
        // Auto-login after signup
        setTimeout(async () => {
          try {
            const loginRes = await loginUser({ email: formData.email, password: formData.password });
            localStorage.setItem('token', loginRes.data.token);
            localStorage.setItem('email', formData.email);
            localStorage.setItem('username', loginRes.data.username);
            navigate('/');
          } catch (loginErr) {
            console.error('Auto-login failed:', loginErr);
            setIsLogin(true);
            setSuccess('');
          }
        }, 800);
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Auth error. Check your backend server.';

      if (status === 400) {
        if (serverMsg.toLowerCase().includes('email')) {
          setError("Looks like this email is already registered. Try signing in, or use a different email.");
        } else if (serverMsg.toLowerCase().includes('username')) {
          setError("This username is already taken. Please choose a different username.");
        } else if (serverMsg.toLowerCase().includes('wrong password')) {
          setError('Incorrect password — try again, or reset your password if you forgot it.');
        } else if (serverMsg.toLowerCase().includes('invalid user')) {
          setError('No account found for this email. Create an account to get started.');
        } else {
          setError(serverMsg);
        }
      } else {
        setError(serverMsg);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '25px',
        padding: '50px 40px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,193,7,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}>
            {isLogin ? '🔐' : '✨'}
          </div>
          <h2 style={{
            fontSize: '2.2rem',
            color: '#2d3748',
            margin: '0 0 10px 0',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {isLogin ? 'Welcome Back' : 'Join Our Family'}
          </h2>
          <p style={{
            color: '#718096',
            fontSize: '1rem',
            margin: '0',
            fontWeight: '400'
          }}>
            {isLogin ? 'Login to manage your fuel deliveries' : 'Create your account to start ordering fuel'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            background: 'linear-gradient(135deg, #48bb78, #38a169)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: '0 8px 25px rgba(72,187,120,0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            ✅ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #e53e3e, #c53030)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: '0 8px 25px rgba(229,62,62,0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          position: 'relative',
          zIndex: 1
        }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '5px'
              }}>
                👤 Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={formData.username}
                onChange={(e) => {
                  setFormData({...formData, username: e.target.value});
                  setError('');
                  setSuccess('');
                }}
                style={{
                  padding: '16px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(5px)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '5px'
            }}>
              📧 Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setError('');
                setSuccess('');
              }}
              style={{
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(5px)',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '5px'
            }}>
              🔒 Password
            </label>
            <input
              type="password"
              placeholder={isLogin ? "Enter your password" : "Create a strong password"}
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setError('');
                setSuccess('');
              }}
              style={{
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(5px)',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {!isLogin && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '5px'
                }}>
                  📱 Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone || ''}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(5px)',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '5px'
                }}>
                  🏠 Delivery Address (Optional)
                </label>
                <textarea
                  placeholder="Enter your full delivery address"
                  value={formData.address || ''}
                  onChange={(e) => {
                    setFormData({...formData, address: e.target.value});
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(5px)',
                    fontWeight: '500',
                    height: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              padding: '18px 24px',
              background: isLogin
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'linear-gradient(135deg, #48bb78, #38a169)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(102,126,234,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(102,126,234,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(102,126,234,0.3)';
            }}
          >
            {isLogin ? '🚀 Login to Account' : '🎉 Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{
            fontSize: '0.95rem',
            color: '#718096',
            margin: '0'
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({ username: '', email: '', password: '', phone: '', address: '' });
              }}
              style={{
                color: '#667eea',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginLeft: '5px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#764ba2';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#667eea';
              }}
            >
              {isLogin ? 'Sign up now' : 'Log in here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;