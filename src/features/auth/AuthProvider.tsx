'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from './auth-context';
import { authApi } from '@/entities/auth/api/auth.api';
import { useApiInitialized } from '@/features/api/ApiInitializer';
import type { UserProfile, User } from '@/entities/auth/model/types';
import { ScreenLoader } from '@/widgets/ScreenLoader/ScreenLoader';

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const { isInitialized: isApiInitialized } = useApiInitialized();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const isAuth = !!user || !!fullUser;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      console.log('[AuthProvider] Fetching user profile...');
      const data = await authApi.getProfile();
      
      if (isMountedRef.current) {
        setUser(data);
        console.log('[AuthProvider] User profile fetched:', data);
      }
      
      return data;
    } catch (error) {
      console.error('[AuthProvider] Failed to fetch user:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    console.log('[AuthProvider] Logging in...');
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    const savedToken = localStorage.getItem('access_token');
    console.log('[AuthProvider] Token saved:', !!savedToken);
    
    if (!savedToken) {
      throw new Error('Failed to save token');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const userData = await fetchUser();
      
      if (isMountedRef.current) {
        setUser(userData);
        console.log('[AuthProvider] Login successful');
      }
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      if (isMountedRef.current) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setFullUser(null);
      }
      throw error;
    }
  }, [fetchUser]);

  const register = useCallback(async ({
    username,
    password,
    age,
    role,
  }: {
    username: string;
    password: string;
    age: string;
    role: 'student' | 'parent';
  }) => {
    console.log('[AuthProvider] Registering...');
    
    try {
      const ageNumber = parseInt(age, 10);
      if (isNaN(ageNumber)) {
        throw new Error('Invalid age');
      }
      
      const response = await authApi.register({
        username,
        password,
        age: ageNumber,
        role,
      });
      
      console.log('[AuthProvider] Registration successful, saving tokens...');
      
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      
      if (isMountedRef.current) {
        setFullUser(response.user);
        
        try {
          const userProfile = await authApi.getProfile();
          setUser(userProfile);
        } catch (profileError) {
          console.error('[AuthProvider] Failed to fetch profile after registration:', profileError);
          // Создаем базовый профиль с правильной структурой UserProfile
          setUser({
            userId: response.user.id,
            username: response.user.username,
            role: response.user.role,
            xp: response.user.xp || 0,
            level: response.user.level || 0,
            coins: response.user.coins || 0,
            achievements: [],
          });
        }
      }
      
      console.log('[AuthProvider] Registration completed successfully');
      
      return response;
    } catch (error) {
      console.error('[AuthProvider] Registration failed:', error);
      if (isMountedRef.current) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setFullUser(null);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('[AuthProvider] Logging out...');
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Передаем объект { refreshToken } как требуется типом LogoutRequest
        await authApi.logout({ refreshToken });
      }
    } catch (error) {
      console.error('[AuthProvider] Logout API call failed:', error);
    } finally {
      if (isMountedRef.current) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setFullUser(null);
      }
      console.log('[AuthProvider] Logout successful');
    }
  }, []);

  const checkAuth = useCallback(async () => {
    console.log('[AuthProvider] Checking auth state...');
    const access = localStorage.getItem('access_token');

    if (!access) {
      console.log('[AuthProvider] No access token found');
      setUser(null);
      setFullUser(null);
      return false;
    }

    try {
      console.log('[AuthProvider] Token found, fetching user...');
      await fetchUser();
      console.log('[AuthProvider] Auth state verified successfully');
      return true;
    } catch (error) {
      console.error('[AuthProvider] Failed to fetch user:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setFullUser(null);
      return false;
    }
  }, [fetchUser]);

  useEffect(() => {
    if (!isApiInitialized) return;
    
    const init = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
    };
    
    init();
  }, [isApiInitialized, checkAuth]);

  useEffect(() => {
    if (!isApiInitialized) return;
    
    if (prevPathnameRef.current !== pathname) {
      console.log('[AuthProvider] Route changed, re-checking auth...');
      checkAuth();
      prevPathnameRef.current = pathname;
    }
  }, [pathname, isApiInitialized, checkAuth]);

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isApiInitialized || isLoading) {
    return <ScreenLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        fullUser,
        isAuth,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};