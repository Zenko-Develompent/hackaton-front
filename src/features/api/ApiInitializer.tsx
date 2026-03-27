'use client';

import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAlert } from '@/features/alert/alert-store';
import { initApiClient } from '@/shared/api/client';

const ApiContext = createContext<{ isInitialized: boolean }>({ isInitialized: false });

export const useApiInitialized = () => useContext(ApiContext);

export function ApiInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const showAlert = useAlert();
  const pathname = usePathname();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Предотвращаем двойную инициализацию
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    console.log('[ApiInitializer] Initializing API client...');
    
    initApiClient({
      fetchImpl: fetch,
      getAccessToken: () => {
        try {
          const token = localStorage.getItem('access_token');
          console.log('[ApiInitializer] getAccessToken called, token exists:', !!token);
          return token;
        } catch {
          return null;
        }
      },
      refresh: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) return null;
          
          console.log('[ApiInitializer] Attempting to refresh token...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (!response.ok) return null;
          
          const data = await response.json();
          localStorage.setItem('access_token', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('refresh_token', data.refreshToken);
          }
          
          console.log('[ApiInitializer] Token refreshed successfully');
          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Token refresh failed:', error);
          return null;
        }
      },
      onAuthFailure: () => {
        console.log('[ApiInitializer] Auth failure detected');
        // НЕ ОЧИЩАЕМ ТОКЕНЫ ЗДЕСЬ!
        // Очистка токенов должна происходить только при logout или когда refresh не сработал
        // Показываем предупреждение, но не чистим токены автоматически
        showAlert({
          variant: 'destructive',
          title: 'Ошибка авторизации',
          description: 'Пожалуйста, войдите снова',
          autoClose: 5000,
        });
      },
    });
    
    setIsInitialized(true);
    console.log('[ApiInitializer] API client initialized');
  }, [showAlert]);

  // Логируем навигацию
  useEffect(() => {
    console.log('[ApiInitializer] Route changed to:', pathname);
  }, [pathname]);

  return (
    <ApiContext.Provider value={{ isInitialized }}>
      {children}
    </ApiContext.Provider>
  );
}