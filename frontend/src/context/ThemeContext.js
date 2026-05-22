import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // SOLO leer del localStorage, sin detección automática de sistema/navegador
    if (typeof window === 'undefined') return true;
    
    const savedTheme = localStorage.getItem('luxhabitat-theme');
    // Si hay un tema guardado, usarlo. Si no, default a dark (premium)
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Aplicar clase dark al root para Tailwind
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('luxhabitat-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('luxhabitat-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};
