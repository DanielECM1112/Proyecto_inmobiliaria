import axios from 'axios'; 

export const BACKEND_ORIGIN = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const BASE_URL = `${BACKEND_ORIGIN}/api`; 

const api = axios.create({ 
  baseURL: BASE_URL, 
}); 
 
api.interceptors.request.use((config) => { 
  const token = localStorage.getItem('token'); 
  if (token) { 
    config.headers.Authorization = `Bearer ${token}`; 
  } 
  return config; 
}); 
 
api.interceptors.response.use( 
  (response) => response, 
  (error) => { 
    if (error.response?.status === 401) { 
      const enLogin = 
        window.location.pathname === '/login' || 
        window.location.pathname === '/admin/login'; 
      if (!enLogin) { 
        localStorage.removeItem('user'); 
        localStorage.removeItem('token'); 
        window.location.href = '/login'; 
      } 
    } 
    return Promise.reject(error); 
  } 
); 
 
export default api; 
