import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'classic' | 'modern' | 'night' | 'future' | 'ocean' | 'sunset';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isModernTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('snaptravel-theme');
    return (savedTheme as ThemeType) || 'classic';
  });

  const isModernTheme = theme === 'modern';

  useEffect(() => {
    localStorage.setItem('snaptravel-theme', theme);
    
    // Apply theme class to document
    document.documentElement.className = `theme-${theme}`;
    
    // Apply modern theme specific styles
    if (isModernTheme) {
      document.body.classList.add('modern-theme-active');
    } else {
      document.body.classList.remove('modern-theme-active');
    }
  }, [theme, isModernTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isModernTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};