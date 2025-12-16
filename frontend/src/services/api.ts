import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
})

// Handle 401 errors - redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear any stored data and redirect to login
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api

