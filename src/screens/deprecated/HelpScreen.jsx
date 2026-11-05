import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const SECTIONS = [
    ['Que hace esta aplicacion?', 'Contacts app te permite guardar y organizar tus contactos: nombre, apellido, edar, correo, telefono, fecha de nacimieto y tipo (Persona)'],
    ['Agregar un contacto', 'En la lista de contactos pulsa <<Agregar contacto>>, llena el formulario y pulsa <<Guardar>>. El nombre es obligatorio; Sin el no se puede guardar'],
    ['Editar un contacto', 'Toca un contacto de la lista. Sus datos se cargan automaticamente en el formulario; modificalos y pulsa <<Guardar>>.'],
    ['Buscar y borrar', 'Usa el buscador para filtrar la lista. Desliza una tarjeta hacia la izquierda y pulsa <<Borrar>> para eliminarla.'],
    ['Menu', 'Abre el menu con el boton de hamburguesa para ver la informacion de la app y esta ayuda.'],
];
export default function HelpScreen() {
    return (
        <ScrollView>
            {SECTIONS.map(([title, body]) => (
                <Fragment key={title}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.body}>{body}</Text>
                </Fragment>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 16, padding: 16 },
    body: { flex: 1, padding: 16 },
});