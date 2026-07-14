import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = 'THEME_MODE';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setIsDark(saved === 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      } finally {
        setLoaded(true);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light').catch((e) =>
      console.error('Failed to save theme', e)
    );
  }, [isDark, loaded]);

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