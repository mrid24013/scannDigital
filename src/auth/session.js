// sesion.js
// Guarda, lee y borra el token de la sesión.
// El resto de la app NO sabe si se usa SecureStore o AsyncStorage.
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

// SecureStore no funciona en la web, así que allí usamos AsyncStorage
const isWeb = Platform.OS === 'web';

export async function saveToken(token) {
  if (isWeb) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function readToken() {
  if (isWeb) {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  if (isWeb) {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}