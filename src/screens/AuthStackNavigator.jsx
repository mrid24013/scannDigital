import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider, useTheme } from '../theme/ThemeContext';

import LoginScreen from './Authorizations/LoginScreen';
import SignUpScreen from './Authorizations/SignUpScreen';

import Tabs from '../components/Tabs';

const Stack = createNativeStackNavigator();
const screens = [
  {name: "Login", component: LoginScreen, icon: "person-outline"},
  {name: "SignUp", component: SignUpScreen, icon: "person-add-outline"},
];
var handleLogin = null;

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {(props) => <Tabs {...props} screens={screens} onAction={handleLogin} />}
      </Stack.Screen>
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