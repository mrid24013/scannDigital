import { WebView } from 'react-native-webview';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchProtectedPdfData } from '../../../api/api';

// Lectura de PDF nativa por medio de API pdf.js de mozilla
function buildPdfHtml(pdfData) {
  return `
   <!DOCTYPE html>
    <html>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <body>
            <script>
                const loadingTask = pdfjsLib.getDocument({ data: atob("${pdfData}") });
                loadingTask.promise.then(async (pdf) => {
                    for (let i = 1; i <= pdf.numPages; i++) {
                        // Prepare canvas using PDF page dimensions
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2 });
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        document.body.appendChild(canvas);

                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    }
                });
            </script>
        </body>
    </html>
  `;
}

export default function PdfViewerScreen({ route, token }) {
  const { id } = route.params || {};
  const [pdfData, setPdfData] = useState({ localUri: null, base64: null });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id || !token) return;

    async function loadPdf() {
      setLoading(true);
      setErrorMessage('');
      try {
        const result = await fetchProtectedPdfData(token, id);
        setPdfData(result);
      } catch (error) {
        setErrorMessage(error.message || 'No se pudo cargar el PDF.');
      } finally {
        setLoading(false);
      }
    }

    loadPdf();
  }, [id, token]);

  const pdfHtml = useMemo(() => {
    if (!pdfData.base64) return null;
    return buildPdfHtml(pdfData.base64);
  }, [pdfData.base64]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <Text style={styles.infoText}>Cargando...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : pdfHtml ? (
        <WebView
          source={{ html: pdfHtml }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 14 },
  infoText: { fontSize: 15 },
  errorText: { fontSize: 15, textAlign: 'center' },
});