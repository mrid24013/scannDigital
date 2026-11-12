import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

// App.jsx
// Aquí vive el estado de la sesión y se decide qué pantalla mostrar.
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { readToken, saveToken, deleteToken } from './src/auth/session';
import TabsStackNavigator from './src/screens/TabStackNavigator';
import AuthStackNavigator from './src/screens/AuthStackNavigator';

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
    screen = <AuthStackNavigator onLogin={handleLogin} />;
  } else {
    screen = <TabsStackNavigator token={token} onLogout={handleLogout} />;
  }

  return (
    <>
      {screen}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
