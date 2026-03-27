'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation'; // добавляем
import { useAlert } from '@/features/alert/alert-store';
import { initApiClient } from '@/shared/api/client';

const ApiContext = createContext<{ isInitialized: boolean }>({ isInitialized: false });

export const useApiInitialized = () => useContext(ApiContext);

export function ApiInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const showAlert = useAlert();
  const pathname = usePathname();

  useEffect(() => {
    console.log('[ApiInitializer] Initializing API client...');
    
    initApiClient({
      fetchImpl: fetch,
      getAccessToken: () => {
        try {
          return localStorage.getItem('access_token');
        } catch {
          return null;
        }
      },
      refresh: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) return null;
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (!response.ok) return null;
          
          const data = await response.json();
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          
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
        console.log('[ApiInitializer] Auth failure, clearing tokens');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        showAlert({
          variant: 'destructive',
          title: 'Сессия истекла',
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