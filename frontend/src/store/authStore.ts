import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
      isAdmin: () => {
        const user = get().user;
        return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
      },
      isSuperAdmin: () => {
        return get().user?.role === 'SUPER_ADMIN';
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
