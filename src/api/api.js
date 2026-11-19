// Llamadas al servidor.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SERIAL_NUMBER = process.env.EXPO_PUBLIC_SERIAL_NUMBER;

const imageBaseURL = `${BASE_URL}/api/photos/${SERIAL_NUMBER}/`;

export function getImageUrl (item) {
    const rawUrl = item?.url || item?.file;
    return rawUrl.startsWith('http') ? rawUrl : `${imageBaseURL}${item?.id}`;
};

export async function postImage(formData) {
    const response = await fetch(imageBaseURL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Error del servidor');
    }

    return await response.json();
}

export async function deleteImage(id) {
    const response = await fetch(`${imageBaseURL}/${id}/`, { 
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error del servidor');
    }

    return await response.json();
}

export async function loadImage() {
    const response = await fetch(imageBaseURL);

    if (!response.ok) {
        throw new Error('Error del servidor');
    }
    
    return await response.json();
}