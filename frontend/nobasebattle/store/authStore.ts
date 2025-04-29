import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  role: string | null
  isAuthenticated: boolean
  setAuth: (accessToken: string, role: string) => void
  setRole: (role: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      role: null,
      isAuthenticated: false,
      setAuth: (accessToken, role) => set({ accessToken, role, isAuthenticated: true }),
      clearAuth: () => set({ accessToken: null, role: null, isAuthenticated: false }),
      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)
