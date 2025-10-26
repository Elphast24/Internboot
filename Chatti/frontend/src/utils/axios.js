import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}/api` || 'http://localhost:5000/api',
});

// Add token to requests
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
