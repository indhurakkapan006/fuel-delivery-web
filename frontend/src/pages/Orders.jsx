import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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
            alert("Your session has expired. Please login again.");
            navigate('/auth');
          }
          setLoading(false);
        });
    }
  }, [token, navigate]);

  if (loading) return <div className="text-center mt-20 font-bold text-blue-600">Retrieving your orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b py-10 mb-8 px-6 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900">My Fuel Orders</h1>
          <p className="text-gray-500 mt-2">Track and manage your past fuel deliveries.</p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md">
            <div className="text-6xl mb-4">⛽</div>
            <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Order Fuel Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center">
                
                {/* Product & Date Info */}
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-16 w-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                    {order.product_name?.includes('Petrol') ? '⛽' : '🚛'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{order.product_name}</h4>
                    <p className="text-sm text-gray-400">
                      Ordered: {new Date(order.order_date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Pricing & Status */}
                <div className="flex items-center justify-between w-full md:w-auto md:gap-12 mt-6 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">Qty: {order.quantity}L</p>
                    <p className="text-2xl font-black text-blue-600">₹{order.total_price}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
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