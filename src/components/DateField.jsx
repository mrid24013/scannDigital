import React from 'react';
import { StyleSheet, TextInput, View, Platform } from 'react-native';

export default function DateField({ value, onChange, placeholder = 'AAAA-MM-DD' }) {
  // Manejo de cambio para Web (usando input HTML tipo date nativo)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={webInputStyle}
        />
      </View>
    );
  }

  // Manejo de formato automático para Android / iOS con TextInput
  const handleChangeText = (text) => {
    // Elimina caracteres no numéricos
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    if (cleaned.length > 4 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    }

    onChange(formatted);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        keyboardType="numeric"
        maxLength={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: { 
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
 },
});

const webInputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '8px',
  borderWidth: '1px',
  outline: '1px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};