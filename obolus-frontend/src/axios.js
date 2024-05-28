import axios from 'axios';
import router from './router';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 403) {
    localStorage.removeItem('token');
    alert('Your session has expired. Please log in again.');
    router.push('/login');
  }
  return Promise.reject(error);
});

export default instance;