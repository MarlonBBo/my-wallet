import { initializeDatabase } from '@/database/initialDatabase';
import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('dark');
  }, []);

  const navTheme = useMemo(
    () => NAV_THEME[colorScheme ?? 'light'],
    [colorScheme]
  );

  return (
    <ThemeProvider value={navTheme}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: navTheme.colors.background }}>
        <SQLiteProvider
          databaseName="my-wallet.db"
          onInit={initializeDatabase}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="new-wallet" />
            <Stack.Screen name="drawer" />
            <Stack.Screen name="income" />
            <Stack.Screen name="expense" />
            <Stack.Screen name='create-category' />
          </Stack>
        </SQLiteProvider>
        <PortalHost />
        
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
