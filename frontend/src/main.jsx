import React from 'react';
import { createRoot } from 'react-dom/client';  // Using createRoot for React 18
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/tailwind.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
);
