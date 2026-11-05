import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ContactCard({ contact, onPress }) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.name}>
                    {contact.nombre} {contact.apellido}
                </Text>
                <Text style={styles.badge}>
                    {contact.tipo}
                </Text>
            </View>
            <Text style={styles.detail}>{contact.telefono}</Text>
            <Text style={styles.detail}>{contact.correo}</Text>
            <Text style={styles.detail}>
                {contact.edad} anios - {contact.fechanacimiento}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { padding: 14, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    name: { fontSize: 17, fontWeight: '600', flexShrink: 1 },
    badge: { fontSize: 12, fontWeight: '600', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
    detail: { fontSize: 14 },
});