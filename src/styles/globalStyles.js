import { StyleSheet } from 'react-native';

// estilos compartidos por toda la app.
export const globalStyles = StyleSheet.create ({
    // Boton principal (Guardar, Agregar contacto, ...)
    button: {
        backgroundColor: '#2563eb',
        height: 52,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    // Se combina con 'button' cuando debe flotar al fondo de la pantalla.
    
})