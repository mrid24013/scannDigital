import { useState } from 'react';
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Picker,
} from "react-native";
import { CONTACT_TYPES } from '../data/contacts';
import { globalStyles } from '../styles/globalStyles';
import DateField from './DateField';

export default function ContactForm({ initialData = null, buttonLabel="Guardar", onSubmit }) {
    const [nombre, setNombre] = useState(initialData?.nombre || '');
    const [apellido, setApellido] = useState(initialData?.apellido || '');
    const [edad, setEdad] = useState(initialData?.edad || '');
    const [correo, setCorreo] = useState(initialData?.correo || '');
    const [telefono, setTelefono] = useState(initialData?.telefono || '');
    const [fechaNacimiento, setFechaNacimiento] = useState(initialData?.fechaNacimiento || '');
    const [tipo, setTipo] = useState(initialData?.tipo || CONTACT_TYPES[0]);
    const [error, setError] = useState('');

    const labelStyle = styles.label;

    const handleSubmit = async () => {
        if (
            !nombre.trim() || !apellido.trim() || !String(edad).trim() || 
            !correo.trim() || !telefono.trim() || !fechaNacimiento.trim()
        ) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        const edadNum = Number(edad);
        if (!Number.isInteger(edadNum) || edadNum < 0 || edadNum > 150) {
            setError('La edad debe ser un numero valido.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(correo.trim())) {
            setError('El correo no es valido.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento.trim())) {
            setError('La fecha debe tener el formato AAAA-MM-DD.');
            return;
        }
        setError('');

        if (onSubmit) {
            onSubmit({
                nombre,
                apellido,
                edad: edadNum,
                correo,
                telefono,
                fechaNacimiento,
                tipo,
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={labelStyle}>Nombre</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre}/>

            <Text style={labelStyle}>Apellido</Text>
            <TextInput style={styles.input} value={apellido} onChangeText={setApellido}/>

            <Text style={labelStyle}>Edad</Text>
            <TextInput 
                style={styles.input} 
                value={edad} 
                onChangeText={(v) => setEdad(v.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={3}
            />

            <Text style={labelStyle}>Correo</Text>
            <TextInput 
                style={styles.input} 
                value={correo} 
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={labelStyle}>Telefono</Text>
            <TextInput 
                style={styles.input} 
                value={telefono} 
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />

            <Text style={labelStyle}>Fecha de nacimiento</Text>
            <DateField value={fechaNacimiento} onChange={setFechaNacimiento}/>

            <Text style={labelStyle}>Tipo de contacto</Text>
            <View style={styles.pickerBox}>
                <Picker 
                    selectedValue={tipo}
                    onValueChange={setTipo}
                    style={Platform.OS === 'web' && styles.webSelect}
                >
                    {CONTACT_TYPES.map((t) => (
                        <Picker.Item key={t} label={t} value={t}/>
                    ))}
                </Picker>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
                style={[
                    globalStyles.button,
                    globalStyles.buttonFormSpacing
                ]}
                onPress={handleSubmit}
            >
                <Text style={[globalStyles.buttonText]}>{buttonLabel}</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    label: { fontSize: 14, fontWight: '600', marginTop: 12, marginBottom: 4 },
    input: { 
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
     },
     pickerBox: { borderWidth: 1, borderRadius: 8, overFlow: 'hidden' },
     webSelect: { width: '100%', paddingHorizontal: 12, paddingVertical: 12, fontSize:16, borderWidth: 0 },
     error: { marginTop: 12 }
  });