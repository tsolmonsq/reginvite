'use client';

import { createContext, useContext, useState } from 'react';

type AlertType = 'success' | 'error' | 'info';

type Alert = {
  message: string;
  type?: AlertType;
};

type AlertContextType = {
  showAlert: (alert: Alert) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (alert: Alert) => {
    setAlert(alert);
    setTimeout(() => setAlert(null), 4000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed top-5 right-5 z-50 w-full max-w-xs bg-white border border-gray-200 shadow-md rounded-lg px-4 py-3 flex items-start gap-3 animate-fade-in">
          <div className="flex-1 items-center text-sm text-gray-800">
            {alert.message}
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition"
            onClick={() => setAlert(null)}
          >
            ×
          </button>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};
