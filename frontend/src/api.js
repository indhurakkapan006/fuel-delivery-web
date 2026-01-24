import axios from 'axios';

const API = axios.create({ baseURL: 'https://fuel-delivery-backend-ksip.onrender.com/api' });

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = () => API.get('/products');
export const loginUser = (formData) => API.post('/login', formData);
export const signupUser = (formData) => API.post('/signup', formData);
export const placeOrder = (orderData) => API.post('/orders', orderData);
export const getMyOrders = () => API.get('/my-orders');
export const getProfile = (email) => API.get(`/profile/${email}`);
export const updateProfile = (data) => API.put('/profile', data);