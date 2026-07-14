import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TodoProvider } from '@/context/TodoContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { AppThemeProvider, useAppTheme } from '@/context/ThemeContext';

function RootLayoutNav() {
  const { isDark } = useAppTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <CategoryProvider>
        <TodoProvider>
          <RootLayoutNav />
        </TodoProvider>
      </CategoryProvider>
    </AppThemeProvider>
  );
}