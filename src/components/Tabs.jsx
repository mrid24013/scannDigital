import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function tabIcon(name) {
    return ({ color, size }) => <Ionicons name={name} size={size} color={color} />;
}

export default function Tabs({ screens = [], onAction }) {
    const getOptions = (screen) => ({
        title: screen.name,
        tabBarLabel: screen.name,
        tabBarIcon: tabIcon(screen.icon),
        ...(((screen.name === 'Login') || (screen.name === 'SignUp')) && {
            headerShown: false,
        }),
        ...(screen.name === 'Home' && {
            headerRight: () => (
                <Pressable style={styles.button} onPress={onAction}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
                </Pressable>
            ),
        }),
    });

    return (
        <Tab.Navigator>
          {screens.map((screen) => {
            var ScreenComponent = screen.component;
    
            return ((screen.name === 'Login') || (screen.name === 'SignUp')) ? (
              <Tab.Screen
                key={screen.name}
                name={screen.name}
                options={getOptions(screen)}
              >
                {(props) => <ScreenComponent {...props} onLogin={onAction} />}
              </Tab.Screen>
            ) : (
              <Tab.Screen
                key={screen.name}
                name={screen.name}
                component={ScreenComponent}
                options={getOptions(screen)}
              />
            );
          })}
        </Tab.Navigator>
      );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
    title: { fontSize: 28, fontWeight: 'bold' },
    name: { fontSize: 20 },
    error: { color: '#c00' },
    button: { backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 5 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});