import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { getProfile } from '../api/auth/authorization';

import HomeScreen from './Tabs/HomeScreen';
import EditScreen from './Tabs/EditScreen';
import ScanScreen from './Tabs/ScanScreens/ScanScreen';
import CategoriesScreen from './Tabs/CategoriesScreen';
import ShareScreen from './Tabs/ShareScreen';
import PhotoScreen from './Tabs/ScanScreens/photo';
import PdfViewerScreen from './Tabs/ScanScreens/PdfViewerScreen';

import Tabs from '../components/Tabs';

const Stack = createNativeStackNavigator();
const screens = [
  {name: "Home", component: HomeScreen, icon: "home-outline"},
  {name: "Editar", component: EditScreen, icon: "create-outline"},
  {name: "Escanear", component: ScanScreen, icon: "camera-outline"},
  {name: "Categorias", component: CategoriesScreen, icon: "albums-outline"},
  {name: "Exportar", component: ShareScreen, icon: "share-outline"},
];
var logout = null;

function MainStack({ token }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {(props) => <Tabs {...props} token={token} screens={screens} onAction={logout} />}
      </Stack.Screen>
      <Stack.Screen name="Photo" options={{ headerShown: false }}>
        {(props) => <PhotoScreen {...props} token={token} />}
      </Stack.Screen>
      <Stack.Screen name="PdfViewer" options={{ headerShown: false }}>
        {(props) => <PdfViewerScreen {...props} token={token} />}
      </Stack.Screen>
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
              <MainStack token={token} />
            </SafeAreaView>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ThemeProvider>
  );
}