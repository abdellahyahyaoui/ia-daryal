from flask import Flask
from flask_cors import CORS
from routes.api import api

app = Flask(__name__)
CORS(app)

app.register_blueprint(api, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health_check():
    return {"status": "ok"}, 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)