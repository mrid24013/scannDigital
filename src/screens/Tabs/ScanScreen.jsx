import { StyleSheet, Text, View, TouchableOpacity, Vibration, Pressable } from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen() {
    const { theme } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [capturedPages, setCapturedPages] = useState([]);

    if (permission) {
        if (!permission.granted) {
            return (
              <View style={[styles.center, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text, marginBottom: 12 }}>Se requieren permisos para utilizar la camara</Text>
                <Pressable style={styles.button} onPress={requestPermission}>
                  <Text style={styles.buttonText}>Dar permiso</Text>
                </Pressable>
              </View>
            );
        }
    }

    const takePicture = async () => {
        if (cameraRef.current) {
          Vibration.vibrate(100);
          const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
          const updatedPages = [...capturedPages, photo.uri];
          setCapturedPages(updatedPages);
        }
    };
    
    const finishScanning = () => {
        if (capturedPages.length === 0) return;
        setCapturedPages([]);
    };

  return (
    <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} ref={cameraRef}>
            <View style={styles.overlayContainer}>
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                        <View style={styles.innerCaptureBtn} />
                    </TouchableOpacity>
                </View>
            </View>
        </CameraView>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>Pagina: {capturedPages.length + 1}</Text>
            {capturedPages.length > 0 && (
                <TouchableOpacity style={styles.doneBtn} onPress={finishScanning}>
                    <Ionicons style={styles.center} name="checkmark-circle" size={48} color="#22c55e" />
                </TouchableOpacity>
            )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlayContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40 },
  controls: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around' },
  captureBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '100%',
  },
  innerCaptureBtn: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
  badge: { backgroundColor: '#000000aa', paddingHorizontal: 12, paddingVertical: 15, borderRadius: 16 },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#fbb323', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  doneBtn: { position: 'absolute', right: 30 },
});