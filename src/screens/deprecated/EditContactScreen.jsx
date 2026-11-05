import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, Pressable, StyleSheet, Text } from 'react-native';
import ContactForm from '../components/ContactForm';

export default function EditContactScreen({ route, navigation }) {
    const { id } = route.params;
    const [currentContact, setCurrentContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
    const SERIAL_NUMBER = process.env.EXPO_PUBLIC_SERIAL_NUMBER;

    useEffect(() => {
        const loadContact = async () => {
            try {
                let endpoint = `${BASE_URL}/api/contacts/${SERIAL_NUMBER}/${id}/`;
                let res = await fetch(endpoint);
                let row = await res.json();

                if (res.ok) {
                    setCurrentContact({
                        id: row.id,
                        nombre: row.first_name || '',
                        apellido: row.last_name || '',
                        edad: row.age != null ? String(row.age) : '',
                        correo: row.email || '',
                        telefono: row.phone || '',
                        fechaNacimiento: row.birth_date || '',
                        tipo: row.contact_type || 'Personal'
                    });
                } else {
                    Alert.alert("Error", "No se encontró el contacto.");
                    navigation.goBack();
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Error al cargar la información.");
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        loadContact();
    }, [id]);

    const handleSave = async (updatedData) => {
        setSaving(true);
        try {
            let endpoint = `${BASE_URL}/api/contacts/${SERIAL_NUMBER}/${id}/`;
            let res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: updatedData.nombre,
                    last_name: updatedData.apellido,
                    age: Number(updatedData.edad),
                    email: updatedData.correo,
                    phone: updatedData.telefono,
                    birth_date: updatedData.fechaNacimiento,
                    contact_type: updatedData.tipo
                })
            });

            if (res.ok) {
                navigation.goBack();
            } else {
                Alert.alert("Error", "No se pudieron guardar los cambios.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Error al actualizar el contacto.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            let endpoint = `${BASE_URL}/api/contacts/${SERIAL_NUMBER}/${id}/`;
            let res = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (res.ok) {
                navigation.goBack();
            } else {
                Alert.alert("Error", "No se pudo eliminar el contacto.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Error al eliminar el contacto.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || saving) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ContactForm 
                buttonLabel="Guardar"
                initialData={currentContact}
                onSubmit={handleSave}
            />
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Eliminar Contacto</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    deleteButton: {
        backgroundColor: '#dc2626',
        padding: 14,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }
});