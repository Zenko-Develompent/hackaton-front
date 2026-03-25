import { createContext } from 'react';
import type { UserProfile } from '@/entities/user/model/types';

interface AuthContextValue {
  user: UserProfile | null;
  isAuth: boolean;
  isLoading: boolean;

  login: (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
