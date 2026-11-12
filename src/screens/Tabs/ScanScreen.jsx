import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext';

export default function ScanScreen() {
    const { theme } = useTheme();

    return (
        <View style={[styles.playground, { backgroundColor: theme.surface, borderColor: theme.border }]}></View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 5, gap: 5 },
    intro: { fontSize: 15, lineHeight: 22 },

    //Contenedor: las propiedades de aqui repartes a los hijos
    playground: {
        height: 'auto', //Altura fija para que justifyContent tenga espacio que repartir tambien en column
        borderWidth: 'auto',
        borderRadius: 12,
        padding: 8,

        //1. Eje principal: hacia donde se colocan los hijos
        flexDirection: 'row', // 'column' | 'row' | 'column-reverse | 'row-reverse'

        //2. Reparte los hijos a lo largo del eje principal
        justifyContent: 'space-evenly', // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'

        //3. Alinea los hijos en el eje cruzado (el perpendicular al principal). Por defecto es 'stretch'
        alignItems: 'stretch', // 'stretch', 'flex-start' | 'center' | 'flex-end'

        //4. Espacio entre hijos
        gap: 8,
    },

    box: {
        minWidth: 56,
        minHeight: 56,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#a32cdd',
        padding: 1,
        margin: 1,
        borderRadius: 8,
        alignItems: 'start',
    },
    text: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }
})