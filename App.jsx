import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import EditScreen from './src/screens/EditScreen';
import ScanScreen from './src/screens/ScanScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import ShareScreen from './src/screens/ShareScreen';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

// App.jsx
// Aquí vive el estado de la sesión y se decide qué pantalla mostrar.
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { readToken, saveToken, deleteToken } from './src/auth/session';
import Login from './src/screens/LoginScreen';
import Inicio from './src/screens/Inicio';
import StackNavigator from './src/screens/StackNavigator';

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true mientras leemos el token guardado

  // Al abrir la app: buscamos si ya había una sesión guardada
  useEffect(() => {
    async function loadSession() {
      const savedToken = await readToken();
      setToken(savedToken);
      setLoading(false);
    }
    loadSession();
  }, []);

  // Se llama desde Login cuando el inicio de sesión fue exitoso
  async function handleLogin(newToken) {
    await saveToken(newToken);
    setToken(newToken);
  }

  // Se llama desde Inicio al pulsar "Cerrar sesión" (o si el token expiró)
  async function handleLogout() {
    await deleteToken();
    setToken(null);
  }
  
  // Decidimos qué pantalla mostrar: cargando, sin sesión o con sesión
  let screen;
  if (loading) {
    screen = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (!token) {
    screen = <Login onLogin={handleLogin} />;
  } else {
    screen = <StackNavigator token={token} onLogout={handleLogout} />;
  }

  return (
    <>
      {screen}
      <StatusBar style="auto" />
    </>
  );

  /*return (
    <ThemeProvider>
      <NavigationContainer>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar style="auto" />
              <MainStack />
            </SafeAreaView>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ThemeProvider>
  );*/
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
