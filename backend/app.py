# from flask import Flask
# from flask_cors import CORS
# from routes.api import api


# app = Flask(__name__)
# CORS(app)
# app.register_blueprint(api, url_prefix='/api')

# if __name__ == '__main__':
#     app.run(debug=True)



from flask import Flask
from flask_cors import CORS
from routes.api import api

app = Flask(__name__)

# Configuración específica de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://darayal.web.app",  # Tu dominio de producción
            "http://localhost:3000",     # Para desarrollo local
            "http://localhost:5173"      # Para desarrollo con Vite
        ],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": False
    }
})

app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)