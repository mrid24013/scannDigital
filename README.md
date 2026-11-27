# scannDigital

Escanea tus documentos en la palma de tu mano.

## Requisitos
* Node.js (18 o superior)
* npm
* Expo Go (58 o superior)

## Datos generales necesarios para el funcionamiento del proyecto
* URL de servidor backend: https://brycab.pythonanywhere.com
* Clave OCR generada en: https://ocr.space/ocrapi/freekey.html

## Variables de entorno necesarias para el funcionamiento del proyecto
* EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1
* EXPO_PUBLIC_API_URL=<SERVIDOR>
* EXPO_PUBLIC_OCR_KEY=<CLAVE>

##Instalacion y Ejecucion
-- Clonado del proyecto github
git clone <URL_DEL_REPOSITORIO>
cd scannerdigital
npm install

-- Verificacion de las dependencias
npx expo install expo-camera

-- Iniciar el proyecto
npx expo start

--- Pruebas en dispositivos moviles
* Verificacion Web: Expo Go - QR
* Verificacion Nativa: npx expo run:android
