import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { loadDocuments } from '../../api/api';

export default function CategoriesScreen({ token, navigation }) {
    const { theme } = useTheme();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Refresca la pestania actual
    useFocusEffect(
        useCallback(() => {
            getDocs();
        }, [token])
    );

    const getDocs = async (isRefresh = false) => {
        if (!token) return;
        isRefresh ? setRefreshing(true) : setLoading(true);
        setErrorMessage('');

        try {
            const list = await loadDocuments(token);
            setDocuments(list);
        } catch (error) {
            setErrorMessage(
                error.message === 'Error del servidor'
                ? 'Error del servidor'
                : 'No se pudo conectar. Intenta de nuevo.'
            );
        }
        setLoading(false);
        setRefreshing(false);
    };
    
    const openFullScreen = (item) => {
        navigation.navigate('PdfViewer', {
            screen: 'Home',
            mode: 'view',
            id: item.id,
            title: item.title,
            category_detail: item.category_detail,
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {loading ? (
                <View style={styles.center}>
                <Text style={styles.text}>Cargando...</Text>
                </View>
            ) : errorMessage ? (
                <View style={styles.center}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            ) : (
                <FlatList
                    data={documents}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.gridContent}
                    columnWrapperStyle={styles.columnWrapper}
                    numColumns={3}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => getDocs(true)} />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.gridItem}>
                            <Text
                                style={styles.categoryLabel}
                                numberOfLines={1}
                            >
                                {item.category_detail?.name || 'Sin categoria'}
                            </Text>
                            
                            <View style={styles.docSheet}>
                                <View style={styles.docLine} />
                                <View style={styles.docLine} />
                                <View style={styles.docLine} />
                                <View style={styles.docLine} />
                                <View style={styles.docLine} />
                                <View style={styles.docLine} />
                            </View>

                            <Text style={[styles.titleLabel, { color: theme.text }]} numberOfLines={1}>
                                {item.title}
                            </Text>

                            <Pressable
                                style={({ pressed }) => [styles.openButton, pressed && styles.openButtonPressed]}
                                onPress={() => openFullScreen(item)}
                            >
                                <Text style={styles.openButtonText}>Abrir</Text>
                            </Pressable>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View>
                            <Text style={[styles.text]}>
                                No hay documentos escaneados.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gridItem: { width: '31%' },
    gridContent: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 100 },
    columnWrapper: { justifyContent: 'flex-start', gap: 12, marginBottom: 22 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    text: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
    openButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    openButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
    docSheet: {
        width: '100%',
        aspectRatio: 0.78,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 7,
        justifyContent: 'space-between',
        elevation: 2,
    },
    docLine: { height: 2.5, backgroundColor: '#cbd5e1', borderRadius: 1, width: '100%' },
    titleLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
});