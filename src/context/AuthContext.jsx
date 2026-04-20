import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_CREDENTIALS, ROLE_PERMISSIONS } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mock_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    const entry = MOCK_CREDENTIALS[email];
    if (!entry || entry.password !== password) {
      throw new Error('Credenciales inválidas');
    }
    localStorage.setItem('mock_user', JSON.stringify(entry.user));
    setUser(entry.user);
    return entry.user;
  };

  const register = async (data) => {
    await new Promise(r => setTimeout(r, 800));
    // Simulate successful registration
    return { success: true, message: 'Cuenta creada. Revisa tu correo para verificar.' };
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  const updateProfile = async (data) => {
    await new Promise(r => setTimeout(r, 500));
    const updated = { ...user, ...data };
    localStorage.setItem('mock_user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPassword, newPassword) => {
    await new Promise(r => setTimeout(r, 500));
    logout();
    return { message: 'Contraseña cambiada.' };
  };

  const hasPermission = useCallback((permission) => {
    if (!user?.rol) return false;
    return (ROLE_PERMISSIONS[user.rol] || []).includes(permission);
  }, [user]);

  const loading = false;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
