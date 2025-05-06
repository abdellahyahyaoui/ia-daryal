

from flask import Flask
from flask_cors import CORS
from routes.api import api

app = Flask(__name__)

# Configuración mejorada de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://deryal.com",
            "https://idaryal.com",
            
            "http://localhost:3001",
            "https://darayal.web.app",
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 86400  # 24 horas en segundos
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
    app.run(debug=True, host='0.0.0.0')
