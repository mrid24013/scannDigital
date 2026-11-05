import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, TextInput, Pressable, FlatList, Text } from 'react-native';
import ContactCard from '../components/ContactCard';
import { globalStyles } from '../styles/globalStyles';

import { useTheme } from '../theme/ThemeContext';

export default function ContactListScreen({navigation}) {
    const { theme } = useTheme();
    const [contacts, setContacts] = useState([]);
    const [query, setQuery] = useState('');

    const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
    const SERIAL_NUMBER = process.env.EXPO_PUBLIC_SERIAL_NUMBER;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadContacts = async () => {
        setLoading(true);
        setError('');
        try {
            let endpoint = BASE_URL + "/api/contacts/" + SERIAL_NUMBER + "/";
            //let endpoint = BASE_URL + "/api/slow/";
            //let endpoint = BASE_URL + "/api/error/";
    
            let res = await fetch(endpoint);
    
            if (!res.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
    
            let contacts_arr = await res.json();
    
            let localContacts = contacts_arr.map((row) => ({
                id: row.id,
                nombre: row.first_name,
                apellido: row.last_name,
                edad: row.age,
                correo: row.email,
                telefono: row.phone,
                fechaNacimiento: row.birth_date,
                tipo: row.contact_type
            }));
    
            setContacts(localContacts);
        } catch (err) {
            setError('Ocurrió un error al cargar los contactos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        navigation.addListener("focus", () => {
            loadContacts();
        })
    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TextInput
                style={[
                    styles.search, 
                    { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }
                ]}
                placeholder="Buscar contacto..."
                placeholderTextColor={theme.placeholder}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
            ) : error ? (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(c) => String(c.id)}
                    renderItem={({ item }) => (
                        <ContactCard
                            contact={item}
                            onPress={() => navigation.navigate("EditContact", { id: item.id })}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No hay contactos.</Text>
                    }
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    search: { 
        fontSize: 16 
    },
    empty: { flex: 1 },
});