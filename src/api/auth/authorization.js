// Llamadas al servidor.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const authBaseURL = `${BASE_URL}/api`;

// Minutos que dura el token. Cámbialo (ej. 1) para demostrar la expiración.
export const EXPIRES_IN_MINS = 3;

// Inicia sesión y devuelve el token.
// Lanza un Error si las credenciales son incorrectas.
export async function login(username, password) {
  const response = await fetch(`${authBaseURL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, EXPIRES_IN_MINS }),
  });

  const data = await response.json();

  if (!response.ok) {
    // DummyJSON responde 400 con { message: 'Invalid credentials' }
    throw new Error(data.username || 'Login failed');
  }

  return data.token;
}

// Crea Usuario y devuelve el token.
// Lanza un Error si los datos son incorrectos.
export async function signup(username, email, password) {
  const response = await fetch(`${authBaseURL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // DummyJSON responde 400 con { message: 'Invalid data' }
    throw new Error(data.username || 'Signup failed');
  }

  // Inicia sesión y devuelve el token despues de crear usuario.
  return login(username, password);
}

// Pide los datos del usuario usando el token.
// Si el token expiró (401), lanza un error con status = 401.
export async function getProfile(token) {
  const response = await fetch(`${authBaseURL}/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = new Error('Profile request failed');
    error.status = response.status;
    throw error;
  }
  return await response.json();
}