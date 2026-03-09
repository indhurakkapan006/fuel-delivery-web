import React, { useState, useEffect } from 'react';
import { placeOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../contexts/PopupContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [availableProducts, setAvailableProducts] = useState([]);
  const navigate = useNavigate();
  const { showError, showSuccess, showWarning, showInfo } = usePopup();

  // Fetch available products to validate cart items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fuel-delivery-backend-ksip.onrender.com/api/products');
        const products = await response.json();
        setAvailableProducts(products);
        console.log('Cart - Available products:', products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);

  const handleCheckout = async () => {
    const email = localStorage.getItem('email'); // Ensure you save this during Login
    console.log('Cart checkout - Email check:', email);
    console.log('Cart checkout - Token check:', !!localStorage.getItem('token'));
    console.log('Cart checkout - Cart items:', cartItems);
    console.log('Cart checkout - Available products:', availableProducts);
    
    if (!email) {
      showError('Login Required', 'Please login to place an order');
      navigate('/auth');
      return;
    }

    // Validate cart items against available products
    const invalidItems = cartItems.filter(cartItem => 
      !availableProducts.some(product => product.id === cartItem.id)
    );

    if (invalidItems.length > 0) {
      console.error('Cart contains invalid products:', invalidItems);
      showWarning('Cart Updated', 'Some items in your cart are no longer available. Please refresh and try again.');
      // Clear invalid items from cart
      const validItems = cartItems.filter(cartItem => 
        availableProducts.some(product => product.id === cartItem.id)
      );
      setCartItems(validItems);
      localStorage.setItem('cart', JSON.stringify(validItems));
      return;
    }

    try {
      console.log('Cart checkout - Placing orders for items:', cartItems);
      // Loop through cart and place orders (Simplified for one item at a time)
      for (const item of cartItems) {
        console.log('Cart checkout - Placing order for item:', item);
        console.log('Cart checkout - Item ID:', item.id, 'Type:', typeof item.id);
        await placeOrder({
          productId: item.id,
          quantity: item.cartQuantity,
          totalPrice: item.price * item.cartQuantity
        });
      }

      showSuccess('Order Placed', '🎉 Order placed successfully!');
      localStorage.removeItem('cart'); // Clear cart after success
      setCartItems([]);
      navigate('/orders');
    } catch (err) {
      console.error("❌ CART CHECKOUT ERROR:", err);
      console.error("Error details:", err.response);
      if (err.response?.status === 403) {
        // Token is invalid/expired, clear it and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        showError('Session Expired', 'Your session has expired. Please login again.');
        navigate('/auth');
      } else {
        showError('Order Failed', `Failed to place order: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    showSuccess('Cart Cleared', 'Your cart has been cleared!');
  };

  const refreshCart = () => {
    // Re-validate cart items against current products
    const validItems = cartItems.filter(cartItem => 
      availableProducts.some(product => product.id === cartItem.id)
    );
    setCartItems(validItems);
    localStorage.setItem('cart', JSON.stringify(validItems));
    if (validItems.length !== cartItems.length) {
      showInfo('Cart Refreshed', `Cart refreshed! ${cartItems.length - validItems.length} invalid items removed.`);
    } else {
      showSuccess('Cart Updated', 'Cart is up to date!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            margin: '0 0 15px 0',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #fff, #e2e8f0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            🛒 Your Fuel Cart
          </h1>
          <p style={{
            fontSize: '1.2rem',
            margin: '0',
            opacity: '0.9',
            fontWeight: '300'
          }}>
            Review your fuel order and proceed to checkout
          </p>
        </header>

        {/* Action Buttons */}
        {cartItems.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={refreshCart}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4a90e2, #357abd)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(74,144,226,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(74,144,226,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(74,144,226,0.3)';
              }}
            >
              🔄 Refresh Cart
            </button>
            <button
              onClick={clearCart}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(229,62,62,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(229,62,62,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(229,62,62,0.3)';
              }}
            >
              🗑️ Clear Cart
            </button>
          </div>
        )}

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              fontSize: '5rem',
              marginBottom: '20px',
              opacity: '0.7'
            }}>
              🛒
            </div>
            <h2 style={{
              fontSize: '2rem',
              margin: '0 0 15px 0',
              color: '#2d3748',
              fontWeight: '700'
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              margin: '0 0 30px 0'
            }}>
              Add some fuel to get started with your order!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(102,126,234,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(102,126,234,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.3)';
              }}
            >
              🛍️ Browse Fuel
            </button>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {/* Cart Items */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#2d3748',
                marginBottom: '25px',
                textAlign: 'center'
              }}>
                📦 Order Summary
              </h2>

              {cartItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '25px 0',
                    borderBottom: index < cartItems.length - 1 ? '1px solid #e2e8f0' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102,126,234,0.05)';
                    e.target.style.borderRadius = '12px';
                    e.target.style.padding = '25px 15px';
                    e.target.style.margin = '0 -15px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderRadius = '0';
                    e.target.style.padding = '25px 0';
                    e.target.style.margin = '0';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      fontSize: '3rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>
                      {item.name === 'Petrol' ? '⛽' : '🚛'}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: '700',
                        color: '#2d3748',
                        margin: '0 0 5px 0'
                      }}>
                        {item.name}
                      </h3>
                      <p style={{
                        fontSize: '1rem',
                        color: '#718096',
                        margin: '0',
                        fontWeight: '500'
                      }}>
                        Quantity: {item.cartQuantity} Liter{item.cartQuantity > 1 ? 's' : ''}
                      </p>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#a0aec0',
                        margin: '5px 0 0 0'
                      }}>
                        ₹{item.price} per liter
                      </p>
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      fontSize: '1.6rem',
                      fontWeight: '800',
                      color: item.name === 'Petrol' ? '#ff6b35' : '#4a90e2',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      ₹{(item.price * item.cartQuantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div style={{
              borderTop: '2px solid #e2e8f0',
              paddingTop: '30px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Total Amount:
                </span>
                <span style={{
                  fontSize: '2.2rem',
                  fontWeight: '800',
                  color: '#667eea',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #48bb78, #38a169)',
                  border: 'none',
                  borderRadius: '15px',
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(72,187,120,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(72,187,120,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(72,187,120,0.3)';
                }}
              >
                💳 Checkout & Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;