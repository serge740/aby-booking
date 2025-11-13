import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from "react";
import { AdminAuthContextProvider } from './context/AdminAuthContext.jsx';
import { CartProvider } from './context/CartContext.tsx';
import { CompanyAuthProvider } from './context/CompanyAuthContext.jsx';
import { EmployeeAuthProvider } from './context/EmployeeAuthContext.tsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthContextProvider>

    <CompanyAuthProvider>
      <EmployeeAuthProvider>

      <CartProvider>

      <App />
      </CartProvider>
      </EmployeeAuthProvider>
    </CompanyAuthProvider>
    </AdminAuthContextProvider>
    
  </StrictMode>
);
