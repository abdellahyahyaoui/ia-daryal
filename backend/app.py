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
from flask import Flask
from flask_cors import CORS
from routes.api import api

app = Flask(__name__)

# Configuración específica de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://darayal.web.app",
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)