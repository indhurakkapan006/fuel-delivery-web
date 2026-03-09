import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../contexts/PopupContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { showError } = usePopup();

  useEffect(() => {
    console.log('Orders page - Token check:', !!token);
    console.log('Orders page - Email from localStorage:', localStorage.getItem('email'));
    
    if (token) {
      setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
      console.log('Orders page - Fetching orders...');
      getMyOrders()
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("❌ ORDERS FETCH ERROR:", err);
          if (err.response?.status === 403) {
            // Token is invalid/expired, clear it and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            showError('Session Expired', 'Your session has expired. Please login again.');
            navigate('/auth');
          }
          setLoading(false);
        });
    }
  }, [token, navigate]);

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
          Retrieving your orders...
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
      {/* Header Section */}
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
          📋 My Fuel Orders
        </h1>
        <p style={{
          fontSize: '1.2rem',
          margin: '0',
          opacity: '0.9',
          fontWeight: '300'
        }}>
          Track and manage your past fuel deliveries
        </p>
      </header>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {orders.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              fontSize: '6rem',
              marginBottom: '25px',
              opacity: '0.7'
            }}>
              ⛽
            </div>
            <h2 style={{
              fontSize: '2.2rem',
              margin: '0 0 15px 0',
              color: '#2d3748',
              fontWeight: '700'
            }}>
              No orders yet
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              margin: '0 0 40px 0'
            }}>
              You haven't placed any orders yet. Start your first fuel delivery!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '18px 35px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '15px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(102,126,234,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
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
              🚀 Order Fuel Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Orders Summary */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#2d3748',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                📊 Order Summary
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#667eea'
                  }}>
                    {orders.length}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#718096',
                    fontWeight: '500'
                  }}>
                    Total Orders
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#48bb78'
                  }}>
                    {orders.filter(o => o.status === 'completed').length}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#718096',
                    fontWeight: '500'
                  }}>
                    Completed
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#ed8936'
                  }}>
                    ₹{orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0).toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#718096',
                    fontWeight: '500'
                  }}>
                    Total Spent
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: order.product_name?.includes('Petrol')
                        ? 'linear-gradient(135deg, #ff6b35, #f7931e)'
                        : 'linear-gradient(135deg, #4a90e2, #357abd)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }}>
                      {order.product_name?.includes('Petrol') ? '⛽' : '🚛'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.6rem',
                        fontWeight: '700',
                        color: '#2d3748',
                        margin: '0 0 5px 0'
                      }}>
                        {order.product_name}
                      </h3>
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#718096',
                        margin: '0',
                        fontWeight: '500'
                      }}>
                        Ordered on {new Date(order.order_date).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '30px',
                      flexWrap: 'wrap'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#a0aec0',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '5px'
                        }}>
                          Quantity
                        </div>
                        <div style={{
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          color: '#2d3748'
                        }}>
                          {order.quantity} Liter{order.quantity > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#a0aec0',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '5px'
                        }}>
                          Total Price
                        </div>
                        <div style={{
                          fontSize: '1.8rem',
                          fontWeight: '800',
                          color: order.product_name?.includes('Petrol') ? '#ff6b35' : '#4a90e2',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          ₹{order.total_price}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#a0aec0',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Status
                      </div>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: order.status === 'completed'
                          ? 'linear-gradient(135deg, #48bb78, #38a169)'
                          : order.status === 'pending'
                          ? 'linear-gradient(135deg, #ed8936, #dd6b20)'
                          : 'linear-gradient(135deg, #a0aec0, #718096)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;