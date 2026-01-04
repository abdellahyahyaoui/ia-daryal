# Guía para generar la APK de Daryal

Para convertir este proyecto React en una aplicación móvil (APK) instalable, sigue estos pasos:

## 1. Preparación del Entorno
Necesitas tener instalado en tu ordenador local:
- **Node.js** y **npm**
- **Android Studio** (para el SDK de Android)

## 2. Instalar Capacitor (Recomendado)
Capacitor es la herramienta moderna de Ionic para convertir apps web en nativas.

```bash
# En la carpeta daryal/
npm install @capacitor/core @capacitor/cli
npx cap init Daryal com.daryal.app --web-dir build
```

## 3. Generar el Build de React
```bash
npm run build
```

## 4. Añadir plataforma Android
```bash
npm install @capacitor/android
npx cap add android
```

## 5. Abrir en Android Studio y Generar APK
```bash
npx cap open android
```
Dentro de Android Studio:
1. Espera a que termine el "Gradle Sync".
2. Ve al menú **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Una vez termine, aparecerá una notificación con el enlace "locate" para encontrar tu archivo `app-debug.apk`.

## Notas Importantes:
- **API Backend:** Asegúrate de cambiar las URLs de `localhost` por la URL pública donde tengas alojado tu backend de Python (puedes usar la URL de Replit si está encendido).
- **Iconos:** Puedes configurar el icono de la app en la carpeta `android/app/src/main/res`.
