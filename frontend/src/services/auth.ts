import api from "./api"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "USER" | "ADMIN"
  phone?: string
}

export interface LoginResponse {
  user: User
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<LoginResponse> {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get("/auth/me")
    return response.data
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },
}

