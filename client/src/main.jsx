import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { BrowserRouter } from 'react-router-dom'; // ✅ IMPORTANT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>   {/* ✅ MUST WRAP APP */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);