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
    data = request.json
    return jsonify({"pregunta": "¿Podrías darme más detalles sobre el comportamiento del vehículo?"})

@app.route('/api/continuar-diagnostico', methods=['POST'])
def continuar_diagnostico():
    data = request.json
    historial = data.get('historial', [])
    messages = [{"role": "system", "content": "Eres un experto en diagnóstico de vehículos."}]
    for h in historial:
        role = "assistant" if h.get('tipo') == 'pregunta' else "user"
        messages.append({"role": role, "content": h.get('texto', '')})
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=800
        )
        content = response.choices[0].message.content
        # Limitar a máximo 5 preguntas (historial de 10 mensajes: 5 user + 5 assistant)
        if len(historial) >= 10:
             return jsonify({"diagnostico_y_soluciones": content})
        return jsonify({"pregunta": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    data = request.json
    codigos = data.get('codigos', [])
    prompt = f"""Actúa como un Ingeniero Mecánico Automotriz experto con 20 años de experiencia en diagnóstico avanzado.
    Analiza rigurosamente los siguientes códigos de falla OBD2: {', '.join(codigos)}.

    Proporciona una respuesta estructurada con:
    1. EXPLICACIÓN TÉCNICA: Qué significa exactamente cada código a nivel de componentes y señales.
    2. CAUSAS PROBABLES: Lista de componentes que podrían estar fallando, priorizando los más comunes.
    3. PROCEDIMIENTO DE DIAGNÓSTICO: Pasos paso a paso (ej: medir voltajes, revisar continuidad, inspección visual) para confirmar la falla.
    4. SOLUCIONES RECOMENDADAS: Desde limpieza hasta reemplazo de piezas específicas.
    5. NIVEL DE URGENCIA: Riesgos de seguir conduciendo con estos códigos.

    Usa un lenguaje técnico pero comprensible y sé extremadamente preciso con los síntomas asociados."""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "Eres un Ingeniero Mecánico experto en diagnóstico avanzado."}, 
                     {"role": "user", "content": prompt}],
            max_tokens=1200
        )
        return jsonify({"diagnostico": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analizar-media', methods=['POST'])
def analizar_media():
    problema = request.form.get('problema', '')
    vehicle_type = request.form.get('vehicleType', 'vehículo')
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
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)