import { create } from "zustand"
import type { User } from "../services/auth"

interface AuthState {
  user: User | null
  setAuth: (user: User) => void
  clearAuth: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (user) => {
    set({ user })
  },
  clearAuth: () => {
    set({ user: null })
  },
  setUser: (user) => set({ user }),
}))

