import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View, Linking } from 'react-native';
import { saveCopyToDocuments } from '../../../data/storage';

export default function ScanScreen({ navigation }) {
  const [flash, setFlash] = useState('off');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const handleOpenSettings = async () => {
    await Linking.openSettings();
  };
  const toggleFacing = () => {
    setReady(false);
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };
  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : current === 'on' ? 'off' : current === 'off'));
  };
  const takePhoto = async () => {
    if (!ready || busy || !cameraRef.current) return;
    setBusy(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const permanentUri = saveCopyToDocuments(photo.uri);
      navigation.navigate('Photo', { uri: permanentUri });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar una copia permanente de la foto.');
    }
    setBusy(false);
  };

  if (permission) {
    if (!permission.granted) {
      const canAskAgain = permission.canAskAgain;
      return (
        <View style={styles.center}>
          <Text style={styles.message}>Necesitamos acceso a la cámara para tomar fotos.</Text>
          <Pressable style={styles.button} onPress={canAskAgain ? requestPermission : handleOpenSettings}>
            <Text style={styles.buttonText}>{canAskAgain ? 'Dar permiso' : 'Abrir ajustes'}</Text>
          </Pressable>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        flash={flash}
        onCameraReady={() => setReady(true)}
      />
      <View style={styles.controls}>
        <View style={styles.side} />
        <Pressable
          style={[styles.shutter, (!ready || busy) && styles.disabled]}
          onPress={takePhoto}
          disabled={!ready || busy}
          accessibilityLabel="Tomar foto"
        >
          {busy ? <ActivityIndicator color="#000" /> : <View style={styles.shutterInner} />}
        </Pressable>
        <View style={styles.side}>
          <Pressable style={styles.flip} onPress={toggleFlash} accessibilityLabel="Cambiar flash">
            <Text style={styles.flipText}>{flash === 'on' ? 'Flash' : 'Sin flash'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
  },
  message: { fontSize: 16, textAlign: 'center' },
  button: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  side: { flex: 1, alignItems: 'flex-end' },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
  disabled: { opacity: 0.5 },
  flip: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  flipText: { color: '#fff', fontWeight: '600' },
});
