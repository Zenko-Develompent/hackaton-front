// features/alert/alert-store.tsx
'use client';

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { AlertTop, AlertTopProps } from "@/features/alert/AlertTop";

type Alert = AlertTopProps & { id: number };
type AlertContextType = (alert: AlertTopProps) => void;

const AlertContext = createContext<AlertContextType>(() => {});

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const idRef = useRef(0);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback((alert: AlertTopProps) => {
    const newAlert = { 
      ...alert, 
      id: idRef.current++,
      autoClose: alert.autoClose ?? 3000, // используем autoClose
    };
    
    setAlerts((prev) => [...prev, newAlert]);

    // Авто-закрытие через указанное время
    if (newAlert.autoClose) {
      setTimeout(() => {
        removeAlert(newAlert.id);
      }, newAlert.autoClose);
    }
  }, [removeAlert]);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alerts.map((alert) => (
        <AlertTop
          key={alert.id}
          {...alert}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};