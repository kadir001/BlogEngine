import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // je backend server
});

// automatische JWT token toevoegen aan headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
