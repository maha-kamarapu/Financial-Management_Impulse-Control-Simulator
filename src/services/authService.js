import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

const authService = {
    isAuthenticated: () => {
      const token = localStorage.getItem("token");
      return !!token; 
    },
  };
  
  export default authService;  

export const fetchAchievements = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/financial/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  };  

// Login function
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem('token', response.data.token); 
  return response.data;
};

// Register function
const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

// Get user profile (Protected route)
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export { login, register, getProfile };
