# Guía de Instalación Local y Despliegue en Render

## 1. Instalación Local
Para correr el proyecto en tu computadora:

### Requisitos:
- Node.js (v18+)
- Python (v3.10+)

### Pasos:
1. **Clonar/Descargar** el proyecto.
2. **Backend**:
   ```bash
   cd server
   pip install flask flask-cors openai python-dotenv
   # Crea un archivo .env con tu OPENAI_API_KEY
   python app.py
   ```
3. **Frontend**:
   ```bash
   cd daryal
   npm install --legacy-peer-deps
   # El archivo package.json ya tiene el proxy configurado
   npm start
   ```

## 2. Despliegue en Render (Backend)
1. Crea un nuevo **Web Service** en Render.
2. Conecta tu repositorio de GitHub.
3. **Configuración**:
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt` (asegúrate de tener este archivo)
   - Start Command: `python server/app.py` (o `gunicorn server.app:app`)
4. **Variables de Entorno**:
   - Agrega `OPENAI_API_KEY` en la pestaña "Environment".

## 3. Conexión Frontend -> Render
Una vez que Render te dé una URL (ej: `https://tu-api.onrender.com`), debes actualizar `daryal/src/api/openai.js`:

```javascript
const apiClient = axios.create({
  baseURL: "https://tu-api.onrender.com/api",
  headers: { "Content-Type": "application/json" }
});
```
Y eliminar la línea `"proxy"` de `package.json`.