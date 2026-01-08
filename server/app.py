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

def generar_prompt_pregunta(data, historial):
    problema = data.get('problema', 'No se proporcionó descripción del problema').lower()
    marca = data.get('marca', 'desconocida')
    modelo = data.get('modelo', 'desconocido')
    año = data.get('año', 'desconocido')
    tipo_vehiculo = data.get('tipo_vehiculo', 'coche')
    
    prompt = f"""
    Actúa como un experto en diagnóstico de vehículos. El vehículo es un {marca} {modelo} del año {año}. 
    Presenta un problema relacionado con {problema}. 

    Basándote en el historial de diálogo y en el problema descrito, genera una pregunta precisa para obtener más detalles que ayuden a identificar la causa raíz. 
    La pregunta debe ser específica y estar enfocada en descartar posibles fallos.
    
    Historial de diálogo:
    {historial}

    La pregunta debe ser enfocada, breve y no exceder los 150 caracteres.
    """
    return prompt.strip()

@app.route('/api/iniciar-diagnostico', methods=['POST'])
def iniciar_diagnostico():
    data = request.json
    try:
        prompt = generar_prompt_pregunta(data, [])
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "Eres un asistente experto en diagnóstico de vehículos."},
                     {"role": "user", "content": prompt}]
        )
        pregunta = response.choices[0].message.content.strip()
        return jsonify({"pregunta": pregunta[:150]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/continuar-diagnostico', methods=['POST'])
def continuar_diagnostico():
    data = request.json
    try:
        historial = data.get('historial', [])
        vehiculo = data.get('vehiculo', {})
        numero_pregunta = len([item for item in historial if item.get('tipo') == 'pregunta']) + 1

        if numero_pregunta <= 5:
            prompt = generar_prompt_pregunta(vehiculo, historial)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "Eres un asistente experto en diagnóstico de vehículos."},
                         {"role": "user", "content": prompt}]
            )
            pregunta = response.choices[0].message.content.strip()
            return jsonify({
                "pregunta": pregunta[:150],
                "es_ultima": numero_pregunta == 5
            })
        else:
            prompt = f"""
            Como experto en diagnóstico automotriz, realiza una evaluación final basada en la información recopilada.
            Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

            Información del vehículo: {vehiculo}
            Historial de preguntas y respuestas: {historial}

            Formato de respuesta:
            Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
            Soluciones:
            1. [Primera solución breve]
            2. [Segunda solución breve]
            3. [Tercera solución breve (opcional)]
            """
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "Eres un asistente experto en diagnóstico de vehículos."},
                         {"role": "user", "content": prompt}]
            )
            return jsonify({"diagnostico_y_soluciones": response.choices[0].message.content.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def interpretar_codigos_error(codigos):
    try:
        codigos_str = ", ".join(codigos)
        prompt = f"""
        Actúa como un experto en diagnóstico automotriz. Se te han proporcionado los siguientes códigos de error: {codigos_str}.
        Por favor, proporciona un diagnóstico detallado y sugerencias para resolver estos problemas.

        Tu respuesta debe tener el siguiente formato:
        Diagnóstico: [Un resumen conciso del problema o problemas indicados por los códigos, Diagnóstico resumido en menos de 250 caracteres]
        Sugerencias:
        1. [Primera sugerencia breve para resolver el problema]
        2. [Segunda sugerencia breve para resolver el problema](si es aplicable)]

        Asegúrate de que el diagnóstico sea claro y las sugerencias sean prácticas y específicas.
        """
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un asistente experto en diagnóstico de vehículos."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error al interpretar códigos: {str(e)}")
        raise

@app.route('/api/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    data = request.json
    codigos = data.get('codigos', [])
    try:
        resultado = interpretar_codigos_error(codigos)
        return jsonify({"diagnostico": resultado})
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