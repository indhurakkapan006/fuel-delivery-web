import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { usePopup } from '../contexts/PopupContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showWarning, showSuccess } = usePopup();

  // 1. Fetch products from MySQL backend on page load
  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching fuel data:", err);
        setLoading(false);
      });
  }, []);

  // 2. Add to Cart Functionality
  const addToCart = (fuel) => {
    // Get existing cart items from localStorage or start with empty array
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const itemExists = existingCart.find(item => item.id === fuel.id);
    
    if (itemExists) {
      showWarning('Already in Cart', `${fuel.name} is already in your cart!`);
    } else {
      existingCart.push({ ...fuel, cartQuantity: 1 });
      localStorage.setItem('cart', JSON.stringify(existingCart));
      showSuccess('Added to Cart', `${fuel.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '500'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }}></div>
          Loading Fuel Prices...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <header style={{
          textAlign: 'center',
          marginBottom: '50px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            margin: '0 0 15px 0',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #fff, #e2e8f0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            ⚡ Instant Fuel Delivery
          </h1>
          <p style={{
            fontSize: '1.3rem',
            margin: '0 auto',
            opacity: '0.9',
            fontWeight: '300',
            maxWidth: '600px'
          }}>
            Select your fuel type and we'll deliver it to your doorstep in minutes.
          </p>
        </header>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {products.map((fuel) => (
            <div
              key={fuel.id}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-10px)';
                e.target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: fuel.name === 'Petrol'
                  ? 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
              }}></div>

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '15px',
                  textAlign: 'center',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  {fuel.name === 'Petrol' ? '⛽' : '🚛'}
                </div>

                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#2d3748',
                  textAlign: 'center'
                }}>
                  {fuel.name}
                </h3>

                <div style={{
                  textAlign: 'center',
                  marginBottom: '25px'
                }}>
                  <span style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: fuel.name === 'Petrol' ? '#ff6b35' : '#4a90e2',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    ₹{fuel.price}
                  </span>
                  <span style={{
                    fontSize: '1.1rem',
                    color: '#718096',
                    fontWeight: '500'
                  }}>
                    /L
                  </span>
                </div>

                {/* Stock Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: fuel.stock_quantity > 0 ? '#48bb78' : '#e53e3e'
                  }}></div>
                  <span style={{
                    fontSize: '0.9rem',
                    color: fuel.stock_quantity > 0 ? '#38a169' : '#c53030',
                    fontWeight: '500'
                  }}>
                    {fuel.stock_quantity > 0 ? `${fuel.stock_quantity}L Available` : 'Out of Stock'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(fuel)}
                  disabled={fuel.stock_quantity === 0}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: fuel.stock_quantity > 0
                      ? (fuel.name === 'Petrol'
                        ? 'linear-gradient(135deg, #ff6b35, #f7931e)'
                        : 'linear-gradient(135deg, #4a90e2, #357abd)')
                      : '#e2e8f0',
                    border: 'none',
                    borderRadius: '12px',
                    color: fuel.stock_quantity > 0 ? 'white' : '#a0aec0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: fuel.stock_quantity > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: fuel.stock_quantity > 0
                      ? '0 8px 25px rgba(0,0,0,0.15)'
                      : 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (fuel.stock_quantity > 0) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (fuel.stock_quantity > 0) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }
                  }}
                >
                  {fuel.stock_quantity > 0 ? '🛒 Add to Cart' : '❌ Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Delivery within 30 minutes' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: '📍', title: 'GPS Tracking', desc: 'Real-time delivery updates' },
            { icon: '⭐', title: 'Quality Assured', desc: 'Premium fuel guaranteed' }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
              <h4 style={{
                color: 'white',
                margin: '0 0 10px 0',
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                {feature.title}
              </h4>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                margin: '0',
                fontSize: '0.95rem'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;