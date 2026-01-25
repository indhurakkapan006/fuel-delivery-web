import React, { useState, useEffect } from 'react';
import { placeOrder } from '../api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [availableProducts, setAvailableProducts] = useState([]);
  const navigate = useNavigate();

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
      alert("Please login to place an order");
      return navigate('/auth');
    }

    // Validate cart items against available products
    const invalidItems = cartItems.filter(cartItem => 
      !availableProducts.some(product => product.id === cartItem.id)
    );

    if (invalidItems.length > 0) {
      console.error('Cart contains invalid products:', invalidItems);
      alert("Some items in your cart are no longer available. Please refresh and try again.");
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

      alert("🎉 Order placed successfully!");
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
        alert("Your session has expired. Please login again.");
        navigate('/auth');
      } else {
        alert(`Failed to place order: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    alert("Cart cleared!");
  };

  const refreshCart = () => {
    // Re-validate cart items against current products
    const validItems = cartItems.filter(cartItem => 
      availableProducts.some(product => product.id === cartItem.id)
    );
    setCartItems(validItems);
    localStorage.setItem('cart', JSON.stringify(validItems));
    if (validItems.length !== cartItems.length) {
      alert(`Cart refreshed! ${cartItems.length - validItems.length} invalid items removed.`);
    } else {
      alert("Cart is up to date!");
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Your Fuel Cart 🛒</h1>
      
      {cartItems.length > 0 && (
        <div className="mb-4 flex gap-2">
          <button 
            onClick={refreshCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Refresh Cart
          </button>
          <button 
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty. Go add some fuel!</p>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-6">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-4">
              <div>
                <h3 className="font-bold text-xl">{item.name}</h3>
                <p className="text-gray-500">Qty: {item.cartQuantity} Liter</p>
              </div>
              <p className="font-bold text-blue-600">₹{item.price * item.cartQuantity}</p>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-2xl font-black">Total: ₹{totalPrice.toFixed(2)}</h2>
            <button 
              onClick={handleCheckout}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Checkout & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;