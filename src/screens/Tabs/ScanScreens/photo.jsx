import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { downloadAndOpenPdf, loadCategories, uploadPdfDocument } from '../../../api/api';
import { previewUri } from '../../../data/data';
import { convertTextToPdf, extractTextFromImage } from '../../../data/documentScanner';

export default function PhotoScreen({ route, navigation, token }) {
  const { screen, uri, mode, id, title: initialTitle } = route.params || {};
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';
  const isScanMode = !isEditMode && !isViewMode;
  const photoUri = previewUri(uri);

  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [docTitle, setDocTitle] = useState( initialTitle );
  const [extractedText, setExtractedText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Al recibir la foto desde la cámara: extraer texto localmente (OCR) y cargar categorías
  useEffect(() => {
    if (!isScanMode || !photoUri) return;
    async function processCapturedPhoto() {
      setBusy(true);
      setErrorMessage('');

      try {
        const [categories, text] = await Promise.all([
          token ? loadCategories(token).catch(() => []) : Promise.resolve([]),
          extractTextFromImage(photoUri),
        ]);

        setCategories(categories);
        setExtractedText(text);

        if (!text) {
          setErrorMessage('No se encontro texto en la foto.');
        }
      } catch (error) {
        setErrorMessage(error.message || 'Error al extraer el texto.');
      }
      setBusy(false);
    }

    processCapturedPhoto();
  }, [isScanMode, photoUri, token]);

  // Convierte el texto extraído a PDF local y sube ÚNICAMENTE el PDF a PythonAnywhere
  const handleGenerateAndUploadPdf = async () => {
    if (!extractedText.trim() || busy) return;

    setBusy(true);
    setErrorMessage('');

    try {
      const finalTitle = docTitle.trim();
      const pdfUri = await convertTextToPdf(extractedText, finalTitle);

      await uploadPdfDocument(token, {
        pdfUri,
        title: finalTitle,
        categoryId: selectedCategory,
      });

      navigation.navigate('Tabs', { screen: screen || 'Home' });
    } catch (error) {
      setErrorMessage(error.message || 'Error al subir al servidor.');
    }
    setBusy(false);
  };

  const handleOpenServerPdf = async () => {
    if (!id || busy) return;
    setBusy(true);
    try {
      await downloadAndOpenPdf(token, id, `${docTitle || `documento_${id}`}.pdf`);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo abrir el PDF.');
    }
    setBusy(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      {isScanMode ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <>
              <Text style={styles.label}>Titulo</Text>
              <TextInput
                style={styles.input}
                value={docTitle}
                onChangeText={setDocTitle}
                placeholder="Ej. Tarea"
              />

              {categories.length > 0 && (
                <>
                  <Text style={styles.label}>Categoria</Text>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.chipsRow}
                  >
                    {categories.map((category) => (
                      <Pressable
                        key={category.id}
                        style={[styles.chip, selectedCategory === category.id && styles.chipSelected]}
                        onPress={() => setSelectedCategory(category.id)}
                      >
                        <Text style={styles.chipText}>{category.name}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </>
              )}

              <Text style={styles.label}>Texto extraido</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={extractedText}
                onChangeText={setExtractedText}
                placeholder="Ej. Dorime"
              />
            </>
        </ScrollView>
      ) : (
        <View style={styles.viewBox}>
          <Text style={styles.viewTitle}>{docTitle}</Text>
          <Pressable
            style={[styles.primary, { paddingHorizontal: 28 }]}
            onPress={handleOpenServerPdf}
            disabled={busy}
          >
            {!busy ? (
              <Text style={styles.primaryText}>Abrir</Text>
            ) : null}
          </Pressable>
        </View>
      )}

      <View style={styles.actions}>
        {isScanMode && (
          <Pressable
            style={[styles.primary, (busy || !extractedText.trim()) && styles.disabled]}
            onPress={handleGenerateAndUploadPdf}
            disabled={busy || !extractedText.trim()}
          >
            {!busy ? (
              <Text style={styles.primaryText}>Generar PDF</Text>
            ) : null}
          </Pressable>
        )}

        <Pressable
          style={styles.secondary}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryText}>Volver</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  previewImage: { width: '100%', height: 380, borderRadius: 12, backgroundColor: '#000' },
  label: { fontSize: 13, fontWeight: '600' },
  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipsRow: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipSelected: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  chipText: { fontSize: 13, fontWeight: '600' },
  textArea: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 220,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
  },
  viewBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  viewTitle: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 38,
    paddingTop: 8,
    gap: 10,
  },
  primary: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondary: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  secondaryText: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  disabled: { opacity: 0.6 },
});