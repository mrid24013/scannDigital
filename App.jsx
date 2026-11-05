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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function tabIcon(name) {
  return ({ color, size }) => <Ionicons name={name} size={size} color={color} />;
}

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home", tabBarLabel: 'Home', tabBarIcon: tabIcon("home-outline") }}
      />
      <Tab.Screen
        name="Editar"
        component={EditScreen}
        options={{ title: "Editar", tabBarLabel: 'Editar', tabBarIcon: tabIcon("create-outline") }}
      />
      <Tab.Screen
        name="Escanear"
        component={ScanScreen}
        options={{ title: "Escanear", tabBarLabel: 'Escanear', tabBarIcon: tabIcon("camera-outline") }}
      />
      <Tab.Screen
        name="Categorias"
        component={CategoriesScreen}
        options={{ title: "Categorias", tabBarLabel: 'Categorias', tabBarIcon: tabIcon("albums-outline") }}
      />
      <Tab.Screen
        name="Exportar"
        component={ShareScreen}
        options={{ title: "Exportar", tabBarLabel: 'Exportar', tabBarIcon: tabIcon("share-outline") }}
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

export default function App() {
  return (
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
  );
}