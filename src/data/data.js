const LOCALE = process.env.EXPO_PUBLIC_LOCALE;

export function formatDate (dateString) {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString(LOCALE, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
};

export function previewUri(uri) {
    return uri && !uri.startsWith('file://') && !uri.startsWith('http')
    ? `file://${uri}`
    : uri;
};
