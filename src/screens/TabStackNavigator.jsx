import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Tabs/HomeScreen';
import EditScreen from './Tabs/EditScreen';
import ScanScreen from './Tabs/ScanScreen';
import CategoriesScreen from './Tabs/CategoriesScreen';
import ShareScreen from './Tabs/ShareScreen';

import { ThemeProvider, useTheme } from '../theme/ThemeContext';

// App.jsx
// Aquí vive el estado de la sesión y se decide qué pantalla mostrar.
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

import { readToken, saveToken, deleteToken } from '../auth/session';
import Login from './Authorizations/LoginScreen';
import { getProfile } from '../auth/api';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
var logout = null;

function tabIcon(name) {
  return ({ color, size }) => <Ionicons name={name} size={size} color={color} />;
}

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ 
          title: "Home", 
          tabBarLabel: 'Home', 
          tabBarIcon: tabIcon("home-outline"), 
          headerRight: () => (
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
          ), 
        }}
      />
      <Tab.Screen
        name="Editar"
        component={EditScreen}
        options={{ 
          title: "Editar", 
          tabBarLabel: 'Editar', 
          tabBarIcon: tabIcon("create-outline"),
          headerRight: () => (
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Escanear"
        component={ScanScreen}
        options={{ 
          title: "Escanear", 
          tabBarLabel: 'Escanear', 
          tabBarIcon: tabIcon("camera-outline"),
          headerRight: () => (
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Categorias"
        component={CategoriesScreen}
        options={{ 
          title: "Categorias", 
          tabBarLabel: 'Categorias', 
          tabBarIcon: tabIcon("albums-outline"),
          headerRight: () => (
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Exportar"
        component={ShareScreen}
        options={{ 
          title: "Exportar", 
          tabBarLabel: 'Exportar', 
          tabBarIcon: tabIcon("share-outline"),
          headerRight: () => (
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default function TabStackNavigator({ token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  logout = onLogout;

  // Al entrar, pedimos el perfil con el token
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (error) {
        if (error.status === 401) {
          onLogout(); // token expirado: cerramos sesión y volvemos al login
        } else {
          setErrorMessage('No se pudo cargar el perfil');
        }
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // se vuelve a ejecutar solo si cambia el token


  return (
    <ThemeProvider>
      <NavigationContainer>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar style="auto"/>
              <MainStack />
            </SafeAreaView>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20 },
  error: { color: '#c00' },
  button: { backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
