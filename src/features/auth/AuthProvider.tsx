'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation'; // добавляем
import { AuthContext } from './auth-context';
import { tokenStorage } from '@/shared/lib/storage';
import { userApi } from '@/entities/user/api/user.api';
import { authApi } from '@/entities/auth/api/auth.api';
import { useApiInitialized } from '@/features/api/ApiInitializer';
import type { UserProfile } from '@/entities/user/model/types';
import { Spinner } from '@/components/ui/spinner';

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const { isInitialized: isApiInitialized } = useApiInitialized();
  const pathname = usePathname(); // отслеживаем путь
  const prevPathnameRef = useRef(pathname);

  const isAuth = !!user;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      console.log('[AuthProvider] Fetching user profile...');
      const data = await userApi.getProfile();
      
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
    tokenStorage.setAccess(accessToken);
    tokenStorage.setRefresh(refreshToken);

    try {
      await new Promise(resolve => setTimeout(resolve, 0));
      const userData = await fetchUser();
      
      if (isMountedRef.current) {
        setUser(userData);
        console.log('[AuthProvider] Login successful');
      }
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      if (isMountedRef.current) {
        tokenStorage.clear();
        setUser(null);
      }
      throw error;
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    console.log('[AuthProvider] Logging out...');
    try {
      const refreshToken = tokenStorage.getRefresh();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('[AuthProvider] Logout API call failed:', error);
    } finally {
      if (isMountedRef.current) {
        tokenStorage.clear();
        setUser(null);
      }
      console.log('[AuthProvider] Logout successful');
    }
  }, []);

  // 🔥 Функция проверки аутентификации
  const checkAuth = useCallback(async () => {
    console.log('[AuthProvider] Checking auth state...');
    const access = tokenStorage.getAccess();
    const refresh = tokenStorage.getRefresh();

    if (!access && !refresh) {
      console.log('[AuthProvider] No tokens found, skipping auth check');
      setUser(null);
      return false;
    }

    try {
      console.log('[AuthProvider] Tokens found, fetching user...');
      await fetchUser();
      console.log('[AuthProvider] Auth state verified successfully');
      return true;
    } catch (error) {
      console.error('[AuthProvider] Failed to fetch user with existing tokens:', error);
      
      // Пробуем обновить токены
      try {
        console.log('[AuthProvider] Attempting to refresh tokens...');
        const data = await authApi.refresh();
        
        tokenStorage.setAccess(data.accessToken);
        tokenStorage.setRefresh(data.refreshToken);
        
        console.log('[AuthProvider] Tokens refreshed, fetching user again...');
        await fetchUser();
        console.log('[AuthProvider] Auth state restored after refresh');
        return true;
      } catch (refreshError) {
        console.error('[AuthProvider] Refresh failed, clearing tokens:', refreshError);
        tokenStorage.clear();
        setUser(null);
        return false;
      }
    }
  }, [fetchUser]);

  // 🔥 Инициализация при монтировании
  useEffect(() => {
    if (!isApiInitialized) return;
    
    const init = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
    };
    
    init();
  }, [isApiInitialized, checkAuth]);

  // 🔥 ОТСЛЕЖИВАЕМ ИЗМЕНЕНИЯ РОУТА
  useEffect(() => {
    if (!isApiInitialized) return;
    
    // Проверяем, изменился ли путь
    if (prevPathnameRef.current !== pathname) {
      console.log('[AuthProvider] Route changed from', prevPathnameRef.current, 'to', pathname);
      console.log('[AuthProvider] Re-checking auth state...');
      
      // Перепроверяем аутентификацию при смене роута
      checkAuth();
      prevPathnameRef.current = pathname;
    }
  }, [pathname, isApiInitialized, checkAuth]);

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isApiInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};