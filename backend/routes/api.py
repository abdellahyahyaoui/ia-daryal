from flask import Blueprint, request, jsonify
from utils.openai_helper import obtener_respuesta_gpt, interpretar_codigos_error
import logging

# Configuración de la API y logger
api = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG)

# Constantes
MAX_QUESTION_LENGTH = 150
MAX_PREGUNTAS = 5
CATEGORIAS_PROBLEMAS = [
    "motor", "transmisión", "frenos", "suspensión", "eléctrico", "sobrecalentamiento", 
    "ruidos", "batería", "dirección", "climatización", "sistemas de escape", 
    "consumo de combustible", "luces", "neumáticos", "sensores", "puertas", 
    "ventanas", "parabrisas", "sistemas de seguridad", "airbags", "cámara de reversa", 
    "sistema de infoentretenimiento", "sistema de arranque", "fugas de fluidos", 
    "transmisión automática", "transmisión manual", "embrague", "calefacción", 
    "refrigeración", "sistemas de control de tracción", "freno de mano", 
    "dirección asistida", "problemas electrónicos generales", "vibraciones"
]

def validar_datos(data, campos_requeridos):
    """
    Valida que los datos proporcionados contengan los campos requeridos.
    """
    errores = [campo for campo in campos_requeridos if campo not in data]
    if errores:
        return False, f"Faltan los siguientes campos: {', '.join(errores)}"
    return True, None

def generar_prompt_pregunta(data, historial):
    """
    Genera un prompt enfocado para obtener preguntas específicas de diagnóstico, basado en 
    la información y respuestas previas del usuario. Mejora el contexto y la claridad de las preguntas.
    """
    problema = data.get('problema', 'No se proporcionó descripción del problema').lower()
    categoria_detectada = next((cat for cat in CATEGORIAS_PROBLEMAS if cat in problema), "general")
    
    prompt = f"""
    Actúa como un experto en diagnóstico de coches. El vehículo es un {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} 
    con motor de {data.get('combustible', 'desconocido')}. Presenta un problema relacionado con {categoria_detectada}. 

    Basándote en el historial de diálogo y en el problema descrito, genera una pregunta precisa para obtener más detalles que ayuden a identificar la causa raíz. 
    La pregunta debe ser específica y estar enfocada en descartar posibles fallos relacionados con {categoria_detectada}.

    Tu tarea es formular una pregunta específica que permita obtener más detalles sobre la causa raíz del problema, tomando en cuenta el historial de conversación, el contexto y la categoría identificada.
    
    Historial de diálogo:
    {historial}

    La pregunta debe ser enfocada, breve y no exceder los {MAX_QUESTION_LENGTH} caracteres.
    """
    return prompt.strip()

@api.route('/iniciar-diagnostico', methods=['POST'])
def iniciar_diagnostico():
    """
    Inicia el diagnóstico generando la primera pregunta basada en la información inicial.
    """
    data = request.json
    logging.debug(f"Received data: {data}")

    valido, error = validar_datos(data, ['problema', 'marca', 'modelo', 'año', 'combustible'])
    if not valido:
        return jsonify({"error": error}), 400

    try:
        historial = []
        prompt = generar_prompt_pregunta(data, historial)
        pregunta = obtener_respuesta_gpt(prompt)
        logging.debug(f"Generated question: {pregunta}")
        return jsonify({"pregunta": pregunta[:MAX_QUESTION_LENGTH]})
    except Exception as e:
        logging.error(f"Error in iniciar_diagnostico: {str(e)}")
        return jsonify({"error": "Ocurrió un error al generar la pregunta inicial"}), 500

@api.route('/continuar-diagnostico', methods=['POST'])
def continuar_diagnostico():
    """
    Continúa el diagnóstico generando preguntas adicionales o el diagnóstico final.
    """
    data = request.json
    logging.debug(f"Received data for continuation: {data}")

    valido, error = validar_datos(data, ['historial', 'vehiculo'])
    if not valido:
        return jsonify({"error": error}), 400

    try:
        historial = data['historial']
        numero_pregunta = len([item for item in historial if item['tipo'] == 'pregunta']) + 1

        if numero_pregunta <= MAX_PREGUNTAS:
            prompt = generar_prompt_pregunta(data, historial)
            siguiente_pregunta = obtener_respuesta_gpt(prompt)
            logging.debug(f"Generated next question: {siguiente_pregunta}")
            return jsonify({
                "pregunta": siguiente_pregunta[:MAX_QUESTION_LENGTH],
                "es_ultima": numero_pregunta == MAX_PREGUNTAS
            })
        else:
            # Diagnóstico final
            prompt = f"""
            Como experto en diagnóstico automotriz, realiza una evaluación final basada en la información recopilada.
            Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

            Información del vehículo: {data['vehiculo']}
            Historial de preguntas y respuestas: {historial}

            Formato de respuesta:
            Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
            Soluciones:
            1. [Primera solución breve]
            2. [Segunda solución breve]
            3. [Tercera solución breve (opcional)]
            """
            respuesta_final = obtener_respuesta_gpt(prompt)
            logging.debug(f"Generated final diagnosis and solutions: {respuesta_final}")
            return jsonify({"diagnostico_y_soluciones": respuesta_final})
    except Exception as e:
        logging.error(f"Error in continuar_diagnostico: {str(e)}")
        return jsonify({"error": "Ocurrió un error al continuar el diagnóstico"}), 500

@api.route('/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    """
    Interpreta los códigos de error del vehículo y genera sugerencias.
    """
    data = request.json
    logging.debug(f"Received data for code interpretation: {data}")

    try:
        codigos = data.get('codigos', [])
        if not codigos:
            return jsonify({"error": "No se proporcionaron códigos para interpretar"}), 400

        interpretacion = interpretar_codigos_error(codigos)
        logging.debug(f"Code interpretation result: {interpretacion}")

        partes = interpretacion.split("Sugerencias:")
        diagnostico = partes[0].replace("Diagnóstico:", "").strip()
        sugerencias = [s.strip() for s in partes[1].split("\n") if s.strip() and not s.strip().isdigit()]

        return jsonify({
            "diagnostico": diagnostico,
            "sugerencias": sugerencias
        })
    except Exception as e:
        logging.error(f"Error in interpretar_codigos: {str(e)}")
        return jsonify({"error": "Ocurrió un error al interpretar los códigos"}), 500

