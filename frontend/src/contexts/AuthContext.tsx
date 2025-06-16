import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { toast } from "sonner";
import { AuthUser, LoginResponse, LoginRequest, SignupRequest, SignupResponse } from '@/types';

interface User {
  id: number;
  email: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await api.post<LoginResponse>('/users/signin', data);
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success("Login successful!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      const response = await api.post<SignupResponse>('/users/new', data);
      toast.success(response.data.message || "Registration successful! Please log in.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast.info("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
