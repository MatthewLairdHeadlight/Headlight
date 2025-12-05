'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo users for development
const demoUsers: Record<string, User> = {
  'dr.smith@clinic.com': {
    id: 'provider-1',
    email: 'dr.smith@clinic.com',
    name: 'Dr. Sarah Smith',
    role: 'provider',
    createdAt: new Date('2024-01-01'),
  },
  'john.doe@email.com': {
    id: 'patient-1',
    email: 'john.doe@email.com',
    name: 'John Doe',
    role: 'patient',
    createdAt: new Date('2024-01-15'),
  },
  'jane.doe@email.com': {
    id: 'patient-2',
    email: 'jane.doe@email.com',
    name: 'Jane Doe',
    role: 'patient',
    createdAt: new Date('2024-02-01'),
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Demo authentication - in production, this would validate against a backend
    const demoUser = demoUsers[email.toLowerCase()];
    if (demoUser) {
      setUser(demoUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
