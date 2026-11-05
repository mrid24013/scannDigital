## 1. Navegación base

npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context

- `@react-navigation/native`: núcleo de la navegación.
- `react-native-screens` y `react-native-safe-area-context`: dependencias requeridas por React Navigation.

## 2. Navegadores

npx expo install @react-navigation/native-stack
npx expo install @react-navigation/bottom-tabs
npx expo install @expo/vector-icons


- `native-stack`: navegación en pila (lista → crear/editar contacto).
- `bottom-tabs`: barra de pestañas inferior.

## 3. Drawer (menú lateral) y sus dependencias

Primero las dependencias, después el navegador:

npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets
npx expo install @react-navigation/drawer

- `react-native-gesture-handler`: gestos para abrir/cerrar el drawer.
- `react-native-reanimated` y `react-native-worklets`: animaciones del drawer.
- `@react-navigation/drawer`: menú lateral.