import { StyleSheet, Text, View } from 'react-native';
import appConfig from '../../app.json';

export default function InfoScreen() {
    const rows = [
        ['Nombre', appConfig.expo.name],
        ['Version', appConfig.expo.version],
        ['Autor', 'Bryan Caballero'],
    ];
    return (
        <View style={styles.container}>
            {rows.map(([label, value]) => (
                <View>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{value}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  