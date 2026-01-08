from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
import base64
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/api/iniciar-diagnostico', methods=['POST'])
def iniciar_diagnostico():
    data = request.json
    logger.info(f"Iniciar diagnóstico: {data}")
    return jsonify({"pregunta": "¿Podrías darme más detalles sobre el comportamiento del vehículo?"})

@app.route('/api/continuar-diagnostico', methods=['POST'])
def continuar_diagnostico():
    data = request.json
    logger.info(f"Continuar diagnóstico: {data}")
    return jsonify({"pregunta": "¿Has notado algún ruido extraño?"})

@app.route('/api/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    data = request.json
    codigos = data.get('codigos', [])
    logger.info(f"Interpretar códigos: {codigos}")
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Interpreta estos códigos OBD2 y da soluciones: {', '.join(codigos)}"}]
        )
        return jsonify({"diagnostico": response.choices[0].message.content})
    except Exception as e:
        logger.error(f"Error en interpretar_codigos: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analizar-media', methods=['POST'])
def analizar_media():
    problema = request.form.get('problema', '')
    vehicle_type = request.form.get('vehicleType', 'vehículo')
    logger.info(f"Analizar media para {vehicle_type}: {problema}")
    results = []
    try:
        for key in request.files:
            file = request.files[key]
            if file.mimetype.startswith('image/'):
                base64_image = base64.b64encode(file.read()).decode('utf-8')
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[{"role": "user", "content": [{"type": "text", "text": f"Analiza esta imagen para un {vehicle_type} con problema: {problema}"}, {"type": "image_url", "image_url": {"url": f"data:{file.mimetype};base64,{base64_image}"}}]}]
                )
                results.append(response.choices[0].message.content)
            elif file.mimetype.startswith('audio/'):
                transcript = client.audio.transcriptions.create(model="whisper-1", file=file)
                results.append(f"Sonido detectado: {transcript.text}")
        return jsonify({"analisis": "\n".join(results)})
    except Exception as e:
        logger.error(f"Error en analizar_media: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Usar puerto 5001 para el backend
    app.run(debug=True, host='0.0.0.0', port=5001)