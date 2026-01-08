from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
import base64
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/api/iniciar-diagnostico', methods=['POST'])
def iniciar_diagnostico():
    return jsonify({"pregunta": "¿Podrías darme más detalles sobre el comportamiento del vehículo?"})

@app.route('/api/continuar-diagnostico', methods=['POST'])
def continuar_diagnostico():
    return jsonify({"pregunta": "¿Has notado algún ruido extraño?"})

@app.route('/api/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    data = request.json
    codigos = data.get('codigos', [])
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Interpreta estos códigos OBD2: {', '.join(codigos)}"}]
        )
        return jsonify({"diagnostico": response.choices[0].message.content})
    except Exception as e:
        logger.error(f"Error in interpretar_codigos: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analizar-media', methods=['POST'])
def analizar_media():
    problema = request.form.get('problema')
    vehicle_type = request.form.get('vehicleType')
    analysis_results = []
    
    try:
        for key in request.files:
            file = request.files[key]
            if file.mimetype.startswith('image/'):
                base64_image = base64.b64encode(file.read()).decode('utf-8')
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": f"Analiza esta imagen de un problema en un {vehicle_type}: {problema}"},
                                {"type": "image_url", "image_url": {"url": f"data:{file.mimetype};base64,{base64_image}"}}
                            ]
                        }
                    ]
                )
                analysis_results.append(response.choices[0].message.content)
            elif file.mimetype.startswith('audio/'):
                transcript = client.audio.transcriptions.create(model="whisper-1", file=file)
                analysis_results.append(f"Transcripción del audio: {transcript.text}")
        return jsonify({"analisis": "\n".join(analysis_results)})
    except Exception as e:
        logger.error(f"Error in analizar_media: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)