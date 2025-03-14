import os
from flask import Flask
from flask_cors import CORS
from routes.api import api

app = Flask(__name__)

# Configuración específica de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://idaryal.com",
            "http://localhost:3001",
            "https://darayal.web.app",
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Registrar las rutas de la API
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render asigna un puerto dinámico
    app.run(host="0.0.0.0", port=port, debug=True)



# from flask import Flask
# from flask_cors import CORS
# from routes.api import api

# app = Flask(__name__)

# # Configuración específica de CORS
# CORS(app, resources={
#     r"/api/*": {
#         "origins": [
#             "https://idaryal.com/",
#             "http://localhost:3001",
#             "https://darayal.web.app",
#             "http://localhost:3000",
#             "http://localhost:5173"
#         ],
#         "methods": ["GET", "POST", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization"],
#         "expose_headers": ["Content-Type", "Authorization"],
#         "supports_credentials": True
#     }
# })

# app.register_blueprint(api, url_prefix='/api')

# if __name__ == '__main__':
#     app.run(debug=True)

