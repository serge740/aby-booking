import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from "react";
import { AdminAuthContextProvider } from './context/AdminAuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthContextProvider>
      <CartProvider>

      <App />
      </CartProvider>
    </AdminAuthContextProvider>
    
  </StrictMode>
);
