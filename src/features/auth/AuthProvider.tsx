'use client';

import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { tokenStorage } from '@/shared/lib/storage';
import { userApi } from '@/entities/user/api/user.api';
import { authApi } from '@/entities/auth/api/auth.api';
import { initApiClient } from '@/shared/api/client';
import type { UserProfile } from '@/entities/user/model/types';

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  const isAuth = !!user;

  // 🔹 Инициализация API клиента (один раз при монтировании)
  useEffect(() => {
    console.log('[AuthProvider] Initializing API client...');
    
    initApiClient({
      fetchImpl: fetch,
      getAccessToken: () => {
        try {
          return tokenStorage.getAccess();
        } catch (error) {
          console.error('[AuthProvider] Error getting access token:', error);
          return null;
        }
      },
      refresh: async () => {
        try {
          const refreshToken = tokenStorage.getRefresh();
          if (!refreshToken) {
            console.log('[AuthProvider] No refresh token available');
            return null;
          }
          
          console.log('[AuthProvider] Refreshing tokens...');
          const data = await authApi.refresh();
          
          tokenStorage.setAccess(data.accessToken);
          tokenStorage.setRefresh(data.refreshToken);
          
          console.log('[AuthProvider] Tokens refreshed successfully');
          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('[AuthProvider] Token refresh failed:', error);
          return null;
        }
      },
      onAuthFailure: () => {
        console.log('[AuthProvider] Auth failure, clearing tokens');
        tokenStorage.clear();
        setUser(null);
      },
    });
    
    setIsApiInitialized(true);
  }, []);

  // 🔹 Получение профиля
  const fetchUser = async () => {
    try {
      console.log('[AuthProvider] Fetching user profile...');
      const data = await userApi.getProfile();
      setUser(data);
      console.log('[AuthProvider] User profile fetched:', data);
    } catch (error) {
      console.error('[AuthProvider] Failed to fetch user:', error);
      throw error;
    }
  };

  // 🔹 Логин (после login API)
  const login = async ({
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
      await fetchUser();
      console.log('[AuthProvider] Login successful');
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      // Если не удалось получить профиль, очищаем токены
      tokenStorage.clear();
      throw error;
    }
  };

  // 🔹 Логаут
  const logout = async () => {
    console.log('[AuthProvider] Logging out...');
    try {
      const refreshToken = tokenStorage.getRefresh();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('[AuthProvider] Logout API call failed:', error);
    } finally {
      tokenStorage.clear();
      setUser(null);
      console.log('[AuthProvider] Logout successful');
    }
  };

  // 🔥 INIT логика (запускается после инициализации API)
  useEffect(() => {
    if (!isApiInitialized) {
      console.log('[AuthProvider] Waiting for API initialization...');
      return;
    }
    
    const init = async () => {
      console.log('[AuthProvider] Initializing auth state...');
      const access = tokenStorage.getAccess();
      const refresh = tokenStorage.getRefresh();

      if (!access && !refresh) {
        console.log('[AuthProvider] No tokens found, skipping auth check');
        setIsLoading(false);
        return;
      }

      try {
        console.log('[AuthProvider] Tokens found, fetching user...');
        await fetchUser();
        console.log('[AuthProvider] Auth state initialized successfully');
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
        } catch (refreshError) {
          console.error('[AuthProvider] Refresh failed, clearing tokens:', refreshError);
          tokenStorage.clear();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    init();
  }, [isApiInitialized]);

  // Показываем loader пока инициализируется API
  if (!isApiInitialized) {
    console.log('[AuthProvider] Showing loader (API not initialized)');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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