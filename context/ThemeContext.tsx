import { createContext, useContext, useState, ReactNode } from 'react';

type Colors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
};

const lightColors: Colors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#222222',
  subtext: '#888888',
  border: '#eeeeee',
};

const darkColors: Colors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f0f0f0',
  subtext: '#aaaaaa',
  border: '#2a2a2a',
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: Colors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within an AppThemeProvider');
  return context;
}