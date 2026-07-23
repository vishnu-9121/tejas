import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';

const ThemeContext = createContext({
  theme: {
    primaryColor: '#0f172a',
    secondaryColor: '#d97706',
    accentColor: '#f59e0b',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, sans-serif'
  }
});

export const ThemeProvider = ({ children }) => {
  const { data: themeData } = useQuery({
    queryKey: ['sanity', 'theme_settings'],
    queryFn: () => sanityService.getThemeSettings(),
    staleTime: 5 * 60 * 1000,
  });

  const theme = themeData || {
    primaryColor: '#0f172a',
    secondaryColor: '#d97706',
    accentColor: '#f59e0b',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, sans-serif'
  };

  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      if (theme.primaryColor) root.style.setProperty('--color-primary-custom', theme.primaryColor);
      if (theme.secondaryColor) root.style.setProperty('--color-secondary-custom', theme.secondaryColor);
      if (theme.accentColor) root.style.setProperty('--color-accent-custom', theme.accentColor);
      if (theme.borderRadius) root.style.setProperty('--radius-custom', theme.borderRadius);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
