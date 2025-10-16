import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from "react";
import { AdminAuthContextProvider } from './context/AdminAuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthContextProvider>

      <App />
    </AdminAuthContextProvider>
    
  </StrictMode>
);
