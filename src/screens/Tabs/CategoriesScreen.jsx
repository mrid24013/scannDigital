import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { formatDate } from '../../data/data';
import { loadImage, getImageUrl } from '../../api/api';

export default function CategoriesScreen({ navigation }) {
  const { theme } = useTheme();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Se ejecuta cada vez que entras o regresas a la pestaña Home (ej. tras subir una foto)
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  const loadPhotos = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage('');

    try {
        const data = await loadImage();
        setPhotos(Array.isArray(data) ? data : []);
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
    const imageUrl = getImageUrl(item);
    if (!imageUrl) return;
  
    navigation.navigate('Photo', {
        screen: 'Categories',
        uri: imageUrl,
        mode: 'view',
        id: item.id,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && photos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.text}>Cargando documentos...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadPhotos(true)} />
          }
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={() => openFullScreen(item)}
            >
                <Image
                    source={{ uri: getImageUrl(item) }}
                    style={styles.thumbnail}
                />
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                        Foto #{item.id}
                    </Text>
                    <Text style={styles.cardDate}>
                        {formatDate(item.created_at)}
                    </Text>
                </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View>
              <Text style={[styles.text]}>
                Todavía no hay fotos escaneadas.
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    text: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
    list: { padding: 12, paddingBottom: 90, gap: 10 },
    card: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        alignItems: 'center'
    },
    thumbnail: { width: 90, height: 90, backgroundColor: '#cbd5e1' },
    cardInfo: { flex: 1, padding: 12, gap: 4 },
    cardTitle: { fontSize: 16, fontWeight: '700' },
    cardDate: { fontSize: 13, color: '#64748b' },
});