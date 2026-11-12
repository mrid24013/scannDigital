// screens/Login.jsx
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { signup } from '../../auth/api';

export default function SignUpScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // react-hook-form maneja los valores y la validación
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { first_name: '',last_name: '', email: '', phone: '', password: '', password_confirm: ''},
  });

  // Solo se ejecuta si los dos campos pasaron la validación
  async function onSubmit({ first_name,last_name, email, phone, password, password_confirm }) {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = await signup(first_name, last_name, email, phone, password, password_confirm);
      await onLogin(token); // App guarda el token y cambia de pantalla
    } catch (error) {
      setErrorMessage(
        error.message === 'account with this email already exists.'
          ? 'Correo ya esta en uso.'
          : 'No se pudo conectar. Intenta de nuevo.'
      );
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crear Usuario</Text>

        <Controller
          control={control}
          name="first_name"
          rules={{ required: 'El nombre es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.first_name && <Text style={styles.error}>{errors.first_name.message}</Text>}

        <Controller
          control={control}
          name="last_name"
          rules={{ required: 'El apellido es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.last_name && <Text style={styles.error}>{errors.last_name.message}</Text>}

        <Controller
          control={control}
          name="email"
          rules={{ required: 'El correo es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Correo"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="phone"
          rules={{ required: 'El telefono es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Telefono"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={{ required: 'La contraseña es obligatoria' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <Controller
          control={control}
          name="password_confirm"
          rules={{ required: 'La contraseña es obligatoria' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Confirma Contraseña"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.password_confirm && <Text style={styles.error}>{errors.password_confirm.message}</Text>}

        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#c00' },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
