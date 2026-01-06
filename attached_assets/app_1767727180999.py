

import os
from flask import Flask
from flask_cors import CORS
from routes.api import api

app = Flask(__name__)

# Configuración mejorada de CORS para entorno Replit y Local
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False,
        "max_age": 86400
    }
})

# Registrar el blueprint de la API
app.register_blueprint(api, url_prefix='/api')

# Ruta para verificar que el servidor está funcionando
@app.route('/health', methods=['GET'])
def health_check():
    return {"status": "ok"}, 200

# Manejador de errores para OPTIONS (preflight)
@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return "", 204

if __name__ == '__main__':
    # Usar el puerto de Replit o 8000 por defecto
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=True, host='0.0.0.0', port=port)
