import { File, Paths } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { shareAsync, isAvailableAsync } from 'expo-sharing';

// Llamadas al servidor.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const DOCUMENTS_URL = `${BASE_URL}/api/documents/`;
const CATEGORIES_URL = `${BASE_URL}/api/categories/`;

function authHeaders(token, isJson = true) {
    return {
      ...(isJson && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  
  async function parseResponse(response) {
    if (response.status === 204) return null;

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.detail || 'Error del servidor');;
    }

    return data;
  }
  
  export async function loadDocuments(token, { search = '', category = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (category && category !== 'all') params.append('category', String(category));
  
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${DOCUMENTS_URL}${query}`, {
      method: 'GET',
      headers: authHeaders(token),
    });
    const data = await parseResponse(response);
    return Array.isArray(data) ? data : data?.results ?? [];
  }

export async function loadCategories(token) {
    const response = await fetch(CATEGORIES_URL, {
      method: 'GET',
      headers: authHeaders(token),
    });
  
    const data = await parseResponse(response);
    return Array.isArray(data) ? data : data?.results ?? [];
  }


  export async function downloadAndOpenPdf(token, id, fileName) {
    const response = await expoFetch(`${DOCUMENTS_URL}${id}/file/`, {
      headers: authHeaders(token, false),
    });
  
    if (!response.ok) {
      throw new Error('No se pudo descargar el PDF protegido.');
    }
  
    const bytes = await response.bytes();
    const safeName = fileName;
    const localFile = new File(Paths.cache, safeName);
    localFile.write(bytes);
  
    if (await isAvailableAsync()) {
      await shareAsync(localFile.uri, {
        mimeType: 'application/pdf',
        dialogTitle: safeName,
      });
    }
    return localFile.uri;
}

export async function fetchProtectedPdfData(token, id) {
    const localFile = new File(Paths.cache, `documento_${id}.pdf`);
    const response = await expoFetch(`${DOCUMENTS_URL}${id}/file/`, {
      headers: authHeaders(token, false),
    });
  
    if (!response.ok) {
      throw new Error('No se pudo descargar el PDF protegido.');
    }
  
    const bytes = await response.bytes();
    localFile.write(bytes);
  
    // Uint8Array a Base64 para renderizarlo
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
  
    return {
      localUri: localFile.uri,
      base64
    };
  }