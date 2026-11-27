import { File, Paths } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import printToFileAsync from 'expo-print';

const OCR_API_KEY = process.env.EXPO_PUBLIC_OCR_KEY;

export async function extractTextFromImage(imageUri) {
  const rawUri =
    imageUri.startsWith('file://') || imageUri.startsWith('content://')
      ? imageUri
      : `file://${imageUri}`;

  // Redimensiona y devuelve base64 directamente desde el manipulador nativo
  const manipulated = await manipulateAsync(
    rawUri,
    [{ resize: { width: 800 } }],
    {
      compress: 0.65,
      format: SaveFormat.JPEG,
      base64: true,
    }
  );

  if (!manipulated.base64) {
    throw new Error('No se pudo procesar la imagen.');
  }

  const formData = new FormData();
  formData.append('base64Image', `data:image/jpeg;base64,${manipulated.base64}`);
  formData.append('apikey', OCR_API_KEY);

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const rawError = await response.text().catch(() => '');
    throw new Error(`OCR HTTP ${response.status}: ${rawError}`);
  }

  const data = await response.json();

  if (data.IsErroredOnProcessing) {
    throw new Error(detail);
  }

  const parsedText = data.ParsedResults?.map((r) => r.ParsedText).join('\n') || '';
  return parsedText.trim();
}

export async function convertTextToPdf(text, title) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <div class="header">
          <strong>${title}</strong>
        </div>
        <div class="content">${text}</div>
      </body>
    </html>
  `;

  const { uri: tempPdfUri } = await printToFileAsync({ html });
  const cleanName = title.trim().toLowerCase();
  const fileName = `${cleanName}_${Date.now()}.pdf`;

  try {
    const sourcePdf = new File(tempPdfUri);
    const destPdf = new File(Paths.document, fileName);
    sourcePdf.copy(destPdf);
    return destPdf.uri;
  } catch {
    return tempPdfUri;
  }
}