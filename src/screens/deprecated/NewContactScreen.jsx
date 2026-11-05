import { useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import ContactForm from '../components/ContactForm';

export default function NewContactScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
    const SERIAL_NUMBER = process.env.EXPO_PUBLIC_SERIAL_NUMBER;

    const handleSave = async (newData) => {
        setLoading(true);
        try {
            let endpoint = BASE_URL + "/api/contacts/" + SERIAL_NUMBER + "/";
            let res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: newData.nombre,
                    last_name: newData.apellido,
                    age: Number(newData.edad),
                    email: newData.correo,
                    phone: newData.telefono,
                    birth_date: newData.fechaNacimiento,
                    contact_type: newData.tipo
                })
            });

            if (res.ok) {
                navigation.navigate("Home");
            } else {
                Alert.alert("Error", "No se pudo guardar el contacto.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <ContactForm 
            buttonLabel="Guardar" 
            onSubmit={handleSave}
        />
    );
}