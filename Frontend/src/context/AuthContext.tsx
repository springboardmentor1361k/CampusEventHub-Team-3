import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { authApi, LoginPayload, RegisterPayload } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    college: string,
    role: UserRole
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Helper: map backend user (_id) to frontend user shape (id)
const mapUser = (backendUser: {
  _id: string;
  name: string;
  email: string;
  college: string;
  role: string;
}): User => ({
  id: backendUser._id,
  name: backendUser.name,
  email: backendUser.email,
  college: backendUser.college,
  role: backendUser.role as UserRole,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('campus_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('campus_token')
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const payload: LoginPayload = { email, password };
        const data = await authApi.login(payload);
        const mappedUser = mapUser(data.user);
        setUser(mappedUser);
        setToken(data.token ?? null);
        localStorage.setItem('campus_user', JSON.stringify(mappedUser));
        if (data.token) localStorage.setItem('campus_token', data.token);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Login failed';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      college: string,
      role: UserRole
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        const payload: RegisterPayload = { name, email, password, college, role: role as 'student' | 'college_admin' };
        await authApi.register(payload);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Registration failed';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_user');
    localStorage.removeItem('campus_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
