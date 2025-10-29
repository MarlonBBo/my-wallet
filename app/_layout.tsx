import { initializeDatabase } from '@/database/initialDatabase';
import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('light');
  }, [setColorScheme]);

  return (
      <GestureHandlerRootView>
        <SQLiteProvider
          databaseName="my-wallet.db"
          onInit={initializeDatabase}
        >
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="new-wallet" options={{ headerShown: false }} />
            <Stack.Screen name="drawer" options={{ headerShown: false }} />
            <Stack.Screen name="income" options={{ headerShown: false }} />
            <Stack.Screen name="expense" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
        </SQLiteProvider>
        <PortalHost/>
      </GestureHandlerRootView>
  );
}
