import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// Las cajas del demo: arreglo estatico, cada objeto es una caja

const BOXES = [
    { id:'1', label:'Contenido A', color:'#ef4444', style: {} },
    { 
        id:'2', 
        label:'Contenido B', 
        color:'#f59e0b', 
        style: {
            //alignSelf: 'flex-end'
        } 
    },
    { 
        id:'3', 
        label:'Contenido C', 
        color:'#10b981', 
        style: {
            //flex: 1
        } 
    },
    /*{ id:'4', label:'D', color:'#3b82f6', style: {} },
    { id:'5', label:'E', color:'#8b5cf6', style: {} },*/
];

export default function FlexboxScreen() {
    const { theme } = useTheme();

    return (
        <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
            <View style={[styles.playground, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {BOXES.map((bax) => (
                    <View>
                        {BOXES.map((box) => (
                            <View key={box.id} style={[styles.box, { backgroundColor: box.color }, box.style]}>
                                <Text style={styles.boxLabel}>{box.label}</Text>
                                <Pressable style={styles.button}>
                                    <Text style={styles.text}>Abrir</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
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