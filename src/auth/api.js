import { Platform } from 'react-native';
// api.js
// Llamadas al servidor (API pública DummyJSON).
//const BASE_URL = 'https://dummyjson.com';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SERIAL_NUMBER = process.env.EXPO_PUBLIC_SERIAL_NUMBER;

// Minutos que dura el token. Cámbialo (ej. 1) para demostrar la expiración.
export const EXPIRES_IN_MINS = 3;

// accessToken no funciona en la web, así que allí usamos token
const isWeb = Platform.OS === 'web';

// Inicia sesión y devuelve el token.
// Lanza un Error si las credenciales son incorrectas.
export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, EXPIRES_IN_MINS }),
  });

  const data = await response.json();

  if (!response.ok) {
    // DummyJSON responde 400 con { message: 'Invalid credentials' }
    throw new Error(data.message || 'Login failed');
  }

  if (isWeb) {
    return data.token;
  } else {
    return data.accessToken;
  }
}

// Crea Usuario y devuelve el token.
// Lanza un Error si los datos son incorrectos.
export async function signup(first_name, last_name, email, phone, password, password_confirm) {
  const response = await fetch(`${BASE_URL}/api/auth/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name,last_name, email, phone, password, password_confirm }),
  });

  const data = await response.json();

  if (!response.ok) {
    // DummyJSON responde 400 con { message: 'Invalid data' }
    throw new Error(data.email || 'Signup failed');
  }

  // Inicia sesión y devuelve el token despues de crear usuario.
  return login(email, password);
}

// Pide los datos del usuario usando el token.
// Si el token expiró (401), lanza un error con status = 401.
export async function getProfile(token) {
  const response = await fetch(`${BASE_URL}/api/auth/get-profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = new Error('Profile request failed');
    error.status = response.status;
    throw error;
  }
  return await response.json();
}