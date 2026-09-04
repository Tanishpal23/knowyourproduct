import axios from 'axios';

// const api = axios.create({ baseURL: '/api' });
const api = axios.create({
  // baseURL: 'https://knowyourproduct-backend.vercel.app/api',
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kyp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const getMe    = ()     => api.get('/auth/me');

// Products
export const getAllProducts      = ()          => api.get('/products');
export const searchProducts      = (params)    => api.get('/products/search', { params });
export const getProductById      = (id)        => api.get(`/products/${id}`);
export const getProductByBarcode = (barcode)   => api.get(`/products/barcode/${barcode}`);
export const compareProducts     = (ids)       => api.post('/products/compare', { ids });

// User
export const getDashboard        = ()          => api.get('/users/dashboard');
export const saveProduct         = (id)        => api.post(`/users/save/${id}`);
export const removeSavedProduct  = (id)        => api.delete(`/users/save/${id}`);
export const updatePreferences   = (prefs)     => api.put('/users/preferences', prefs);
export const recordScan          = (id)        => api.post(`/users/scan/${id}`);

export default api;
