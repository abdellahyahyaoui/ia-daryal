import logging
from flask import Blueprint, request, jsonify
from utils.openai_helper import obtener_respuesta_gpt

api = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG)
MAX_QUESTION_LENGTH = 150

def generar_prompt_pregunta(data, historial):
    """
    Genera un prompt más enfocado para la obtención de preguntas de diagnóstico específicas., basado en la informacion y respuestas del usuario.
    """
    # Categorías de problemas comunes
    categorias = ["motor", "transmisión", "frenos", "suspensión", "eléctrico", "sobrecalentamiento", "ruidos"]
    problema = data.get('problema', 'No se proporcionó descripción del problema').lower()

    # Identificar categoría del problema
    categoria_detectada = next((cat for cat in categorias if cat in problema), "general")

    prompt = f"""
    Actúa como un experto en diagnóstico de coches. El vehículo es un {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} 
    con motor de {data.get('combustible', 'desconocido')}. Presenta un problema relacionado con {categoria_detectada}. 

    Basándote en el historial de diálogo y en el problema descrito, genera una pregunta precisa para obtener más detalles que ayuden a identificar la causa raíz. 
    La pregunta debe ser específica y estar enfocada en descartar posibles fallos relacionados con {categoria_detectada}.

    Historial de diálogo:
    {historial}

    Problema inicial descrito:
    {problema}

    La pregunta debe ser breve y clara (máximo {MAX_QUESTION_LENGTH} caracteres).
    """
    return prompt

@api.route('/iniciar-diagnostico', methods=['POST'])
def iniciar_diagnostico():
    logging.debug(f"Received data: {request.json}")
    data = request.json
    try:
        historial = []
        prompt = generar_prompt_pregunta(data, historial)
        pregunta = obtener_respuesta_gpt(prompt)
        logging.debug(f"Generated question: {pregunta}")
        return jsonify({"pregunta": pregunta[:MAX_QUESTION_LENGTH]})
    except Exception as e:
        logging.error(f"Error in iniciar_diagnostico: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/continuar-diagnostico', methods=['POST'])
def continuar_diagnostico():
    logging.debug(f"Received data for continuation: {request.json}")
    data = request.json
    try:
        historial = data.get('historial', [])
        numero_pregunta = len([item for item in historial if item['tipo'] == 'pregunta']) + 1
        info_vehiculo = data.get('vehiculo', {})

        if numero_pregunta <= 5:
            prompt = generar_prompt_pregunta(data, historial)
            siguiente_pregunta = obtener_respuesta_gpt(prompt)
            logging.debug(f"Generated next question: {siguiente_pregunta}")
            return jsonify({"pregunta": siguiente_pregunta[:MAX_QUESTION_LENGTH], "es_ultima": numero_pregunta == 10})
        else:
            # Diagnóstico final
            prompt = f"""
            Como experto en diagnóstico automotriz, realiza una evaluación final basada en la información recopilada.
            Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

            Información del vehículo: {info_vehiculo}
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
        return jsonify({"error": str(e)}), 500

@api.route('/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    data = request.json
    try:
        codigos = data.get('codigos', [])
        # Aquí debes implementar la lógica para interpretar los códigos
        # Por ejemplo:
        prompt = f"Interpreta los siguientes códigos de error: {', '.join(codigos)}"
        interpretacion = obtener_respuesta_gpt(prompt)
        return jsonify({"interpretacion": interpretacion})
    except Exception as e:
        logging.error(f"Error in interpretar_codigos: {str(e)}")
        return jsonify({"error": str(e)}), 500



























# import logging
# from flask import Blueprint, request, jsonify
# from utils.openai_helper import obtener_respuesta_gpt

# api = Blueprint('api', __name__)
# logging.basicConfig(level=logging.DEBUG)
# MAX_QUESTION_LENGTH = 300

# @api.route('/iniciar-diagnostico', methods=['POST'])
# def iniciar_diagnostico():
#     logging.debug(f"Received data: {request.json}")
#     data = request.json
#     try:
#         prompt = f"""
#         Un coche {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} 
#         con motor de {data.get('combustible', 'desconocido')} presenta el siguiente problema: 
#         {data.get('problema', 'No se proporcionó descripción del problema')}. 
#         Genera una pregunta específica y relevante para obtener más información sobre el problema. 
#         La pregunta debe estar directamente relacionada con el diagnóstico de la avería descrita.
#         """
#         logging.debug(f"Generated prompt: {prompt}")
#         pregunta = obtener_respuesta_gpt(prompt)
#         logging.debug(f"Generated question: {pregunta}")
#         return jsonify({"pregunta": pregunta[:MAX_QUESTION_LENGTH]})
#     except Exception as e:
#         logging.error(f"Error in iniciar_diagnostico: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# @api.route('/continuar-diagnostico', methods=['POST'])
# def continuar_diagnostico():
#     logging.debug(f"Received data for continuation: {request.json}")
#     data = request.json
#     try:
#         historial = data.get('historial', [])
#         numero_pregunta = len([item for item in historial if item['tipo'] == 'pregunta']) + 1
#         info_vehiculo = data.get('vehiculo', {})

#         # Generamos una nueva pregunta para el diagnóstico sin validaciones adicionales
#         if numero_pregunta <= 5:
#             prompt = f"""
#             Eres un experto en diagnóstico automotriz. Basado en la información del vehículo y el historial de diálogo,
#             genera una pregunta específica para continuar el diagnóstico. 

#             Información del vehículo: {info_vehiculo}
#             Historial de preguntas y respuestas: {historial}

#             La pregunta debe ayudar a identificar el problema específico del vehículo y ser breve (máximo {MAX_QUESTION_LENGTH} caracteres).
#             """
#             siguiente_pregunta = obtener_respuesta_gpt(prompt)
#             logging.debug(f"Generated next question: {siguiente_pregunta}")
#             return jsonify({"pregunta": siguiente_pregunta[:MAX_QUESTION_LENGTH], "es_ultima": numero_pregunta == 5})
#         else:
#             # Generamos el diagnóstico final
#             prompt = f"""
#             Basándote en toda la información recopilada sobre el vehículo y el historial de preguntas y respuestas, 
#             proporciona un diagnóstico final resumido en menos de 100 caracteres, seguido de 2-3 posibles soluciones breves.

#             Información del vehículo: {info_vehiculo}
#             Historial: {historial}

#             Formato de respuesta:
#             Diagnóstico: [Diagnóstico resumido en menos de 100 caracteres]
#             Soluciones:
#             1. [Primera solución breve]
#             2. [Segunda solución breve]
#             3. [Tercera solución breve (opcional)]
#             """
#             respuesta_final = obtener_respuesta_gpt(prompt)
#             logging.debug(f"Generated final diagnosis and solutions: {respuesta_final}")
#             return jsonify({"diagnostico_y_soluciones": respuesta_final})
#     except Exception as e:
#         logging.error(f"Error in continuar_diagnostico: {str(e)}")
#         return jsonify({"error": str(e)}), 500
