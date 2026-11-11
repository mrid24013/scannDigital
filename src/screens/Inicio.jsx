// screens/Inicio.jsx
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { getProfile } from '../auth/api';

export default function Inicio({ token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
    <View style={styles.container}>
      <Text style={styles.title}>¡Sesión iniciada!</Text>

      {profile ? (
        <Text style={styles.name}>Hola, {profile.firstName} {profile.lastName}</Text>
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <ActivityIndicator />
      )}

      <Pressable style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20 },
  error: { color: '#c00' },
  button: { backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
