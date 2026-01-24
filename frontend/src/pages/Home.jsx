import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      alert(`${fuel.name} is already in your cart!`);
    } else {
      existingCart.push({ ...fuel, cartQuantity: 1 });
      localStorage.setItem('cart', JSON.stringify(existingCart));
      alert(`${fuel.name} added to cart!`);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Fuel Prices...</div>;

  return (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
    <header style={{ marginBottom: '30px' }}>
      <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Instant Fuel Delivery</h1>
      <p style={{ color: '#666' }}>Select your fuel type and we'll deliver it to your location.</p>
    </header>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
      {products.map((fuel) => (
        <div key={fuel.id} className="card" style={{ padding: '20px', position: 'relative' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{fuel.name === 'Petrol' ? '⛽' : '🚛'}</div>
          <h3 style={{ margin: '10px 0' }}>{fuel.name}</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>₹{fuel.price}<span style={{fontSize: '0.9rem'}}> /L</span></p>
          
          <div style={{ marginTop: '15px' }}>
            {fuel.stock_quantity > 0 ? (
              <button 
                onClick={() => addToCart(fuel)}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', border: 'none', color: '#000' }}>
                Add to Cart
              </button>
            ) : (
              <button disabled style={{ width: '100%', padding: '12px', background: '#eee', border: 'none', color: '#999' }}>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Home;