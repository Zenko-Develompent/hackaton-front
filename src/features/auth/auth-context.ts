// features/auth/auth-context.ts
import { createContext } from 'react';
import type { UserProfile, User } from '@/entities/auth/model/types';

interface AuthContextValue {
  user: UserProfile | null;
  fullUser: User | null;
  isAuth: boolean;
  isLoading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }) => Promise<void>;
  register: (data: {
    username: string;
    password: string;
    age: string;
    role: 'student' | 'parent';
  }) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);