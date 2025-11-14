import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from "react";
import { AdminAuthContextProvider } from './context/AdminAuthContext.jsx';
import { CartProvider } from './context/CartContext.tsx';
import { CompanyAuthProvider } from './context/CompanyAuthContext.jsx';
import { EmployeeAuthProvider } from './context/EmployeeAuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { SocketProvider } from './context/SocketContext.tsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider serverUrl={`${import.meta.env.VITE_API_URL}`}>

      <AdminAuthContextProvider>
        <CompanyAuthProvider>
          <EmployeeAuthProvider>
            <NotificationProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </NotificationProvider>
          </EmployeeAuthProvider>
        </CompanyAuthProvider>
      </AdminAuthContextProvider>

    </SocketProvider>
  </StrictMode>
);
