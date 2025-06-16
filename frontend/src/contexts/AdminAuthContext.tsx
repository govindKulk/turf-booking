
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignin, adminSignup } from '@/lib/adminApi';
import { toast } from "sonner";
import { AdminUser, AdminLoginDto, AdminDto, AdminLoginResponse } from '@/types';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  login: (data: AdminLoginDto) => Promise<void>;
  signup: (data: AdminDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminUser');
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: AdminLoginDto) => {
    try {
      const response = await adminSignin(data);
      const { token, ...adminData } = response;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      setAdmin(adminData);
      toast.success("Admin login successful!");
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Admin login failed. Please check your credentials.");
      throw error;
    }
  };

  const signup = async (data: AdminDto) => {
    try {
      const response = await adminSignup(data);
      toast.success(response.message || "Admin registration successful! Please log in.");
      navigate('/admin/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Admin registration failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
    navigate('/admin/login');
    toast.info("Admin logged out successfully.");
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated: !!admin, 
      admin, 
      login, 
      signup, 
      logout, 
      isLoading 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
