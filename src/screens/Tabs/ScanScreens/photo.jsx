import { File } from 'expo-file-system';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { postImage, deleteImage } from '../../../api/api';
import { previewUri } from '../../../data/data';

export default function PhotoScreen({ route, navigation }) {
  const { screen, uri, mode, id } = route.params || {};
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';
  const prevUri = previewUri(uri);
  const handleUpload = async () => {
    if (!prevUri) return;
    setUploading(true);
    setErrorMessage('');

    try {
      // Crear instancia de File compatible con FormData y fetch en Expo
      const file = new File(prevUri);
      const formData = new FormData();
      formData.append('image', file);

      postImage(formData);
      navigation.navigate('Tabs', { screen: screen });
    } catch (error) {
        setErrorMessage(
          error.message === 'Error del servidor' || 'Enter a valid email address.'
            ? 'Error del servidor'
            : 'No se pudo conectar. Intenta de nuevo.'
        );
    }
    setUploading(false);
  };
  const handleDelete = async () => {
    if (!id) return;
    setUploading(true);

    try {
      deleteImage(id);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la foto del servidor.');
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}/>
      <Image source={{ uri: prevUri }} style={styles.image} resizeMode="contain"/>
      {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
      <View style={styles.actions}>
        {!isEditMode ? (
          <>
            {!isViewMode ? (
              <>
                <Pressable
                  style={[styles.primary, (uploading || !prevUri) && styles.disabled]}
                  onPress={handleUpload}
                  disabled={uploading || !prevUri}
                >
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryText}>Guardar</Text>
                  )}
                </Pressable>
              </>
            ) : (null)}
          </>
        ) : (
          <>
            {id ? (
              <Pressable
                style={[styles.deleteBtn, uploading && styles.disabled]}
                onPress={handleDelete}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryText}>Borrar</Text>
                )}
              </Pressable>
            ) : null}
          </>
        )}
        <Pressable
              style={styles.secondary}
              onPress={() => navigation.goBack()}
              disabled={uploading}
            >
              <Text style={styles.secondaryText}>Volver</Text>
            </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    paddingTop: 48,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  image: { flex: 1 },
  actions: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
    gap: 12,
  },
  primary: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondary: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  secondaryText: { fontSize: 16, fontWeight: '700', color: '#000' },
  disabled: { opacity: 0.6 },
});