import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Set user data and token
      setCredentials: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      // Update only access token (used during refresh)
      setAccessToken: (accessToken) =>
        set((state) => ({ ...state, accessToken })),

      // Logout and clear state
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of item in the storage (must be unique)
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
