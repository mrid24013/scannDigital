import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider, useTheme } from '../theme/ThemeContext';

// App.jsx
// Aquí vive el estado de la sesión y se decide qué pantalla mostrar.
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

import { readToken, saveToken, deleteToken } from '../auth/session';
import LoginScreen from './Authorizations/LoginScreen';
import SignUpScreen from './Authorizations/SignUpScreen';
import { getProfile } from '../auth/api';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
var handleLogin = null;

function tabIcon(name) {
  return ({ color, size }) => <Ionicons name={name} size={size} color={color} />;
}

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Login"
        options={{ 
          title: "Login", 
          tabBarLabel: 'Login', 
          tabBarIcon: tabIcon("person-outline"), 
          headerShown: false
        }}
      >
        {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
      </Tab.Screen>
      <Tab.Screen
        name="SignUp"
        options={{ 
          title: "SignUp", 
          tabBarLabel: 'SignUp', 
          tabBarIcon: tabIcon("person-add-outline"),
          headerShown: false
        }}
      >
        {(props) => <SignUpScreen {...props} onLogin={handleLogin} />}
      </Tab.Screen>
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

export default function AuthStackNavigator({ onLogin }) {
    handleLogin = onLogin
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
