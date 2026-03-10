import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark class to document root with more aggressive approach
    const root = document.documentElement;
    const body = document.body;
    const rootDiv = document.getElementById('root');
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      if (rootDiv) rootDiv.classList.add('dark');
      
      // Force style attributes as backup
      root.style.colorScheme = 'dark';
      root.style.backgroundColor = '#111827';
      body.style.backgroundColor = '#111827';
      body.style.color = '#f9fafb';
      
      console.log('Dark mode enabled - classes applied to html, body, and root');
      console.log('HTML classes:', root.className);
      console.log('Body classes:', body.className);
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      if (rootDiv) rootDiv.classList.remove('dark');
      
      root.style.colorScheme = 'light';
      root.style.backgroundColor = '#f9fafb';
      body.style.backgroundColor = '#f9fafb';
      body.style.color = '#111827';
      
      console.log('Light mode enabled - dark classes removed');
      console.log('HTML classes:', root.className);
      console.log('Body classes:', body.className);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      console.log('Toggling dark mode to:', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};