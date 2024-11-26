import logging
from flask import Blueprint, request, jsonify
from utils.openai_helper import obtener_respuesta_gpt, interpretar_codigos_error

api = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG)
MAX_QUESTION_LENGTH = 150

# Función para generar preguntas de diagnóstico
def generar_prompt_pregunta(data, historial):
    """
    Genera un prompt para obtener preguntas de diagnóstico específicas.
    """
    categorias = ["motor", "transmisión", "frenos", "suspensión", "eléctrico", "sobrecalentamiento", "ruidos"]
    problema = data.get('problema', 'No se proporcionó descripción del problema').lower()

    # Validar que el problema esté relacionado con los problemas automotrices
    categoria_detectada = next((cat for cat in categorias if cat in problema), "general")
    
    prompt = f"""
    Actúa como un experto en diagnóstico de coches. El vehículo es un {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} 
    con motor de {data.get('combustible', 'desconocido')}. Presenta un problema relacionado con {categoria_detectada}. 

    Basándote en el historial de diálogo y en el problema descrito, genera una pregunta precisa para obtener más detalles que ayuden a identificar la causa raíz. 
    La pregunta debe ser breve y clara (máximo {MAX_QUESTION_LENGTH} caracteres).

    Historial de diálogo:
    {historial}

    Problema inicial descrito:
    {problema}
    """
    return prompt

# Ruta para iniciar el diagnóstico
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
        logging.error(f"Error en iniciar_diagnostico: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Ruta para continuar el diagnóstico
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
            # Diagnóstico final con generación de sarcasmo por la IA
            problema = data.get('problema', '').lower()
            categorias_validas = ["motor", "transmisión", "frenos", "suspensión", "eléctrico", "sobrecalentamiento", "ruidos"]

            if not any(cat in problema for cat in categorias_validas):
                # Si el problema no es válido, pedirle a la IA que genere un mensaje sarcástico
                prompt_burlon = f"""
                El usuario ha estado proporcionando respuestas irrelevantes o poco útiles para el diagnóstico. 
                Genera un diagnóstico sarcástico y divertido para cerrar la conversación, pero mantén el tono ligero.
                Historial de respuestas del usuario: {historial}
                Diagnóstico: "Parece que tu coche tiene un problema de imaginación. La próxima vez, por favor, proporciona un problema de coche real."
                """
                respuesta_final = obtener_respuesta_gpt(prompt_burlon)
            else:
                # Si el problema es válido, generar un diagnóstico real
                prompt = f"""
                Como experto en diagnóstico automotriz, realiza una evaluación final basada en la información recopilada.
                Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

                Información del vehículo: {data.get('vehiculo', {})}
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
        logging.error(f"Error en continuar_diagnostico: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Ruta para interpretar códigos de error
@api.route('/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    logging.debug(f"Received data for code interpretation: {request.json}")
    data = request.json
    try:
        codigos = data.get('codigos', [])
        if not codigos:
            return jsonify({"error": "No se proporcionaron códigos para interpretar"}), 400

        interpretacion = interpretar_codigos_error(codigos)
        logging.debug(f"Code interpretation result: {interpretacion}")
        
        # Procesar la respuesta para extraer el diagnóstico y las sugerencias
        partes = interpretacion.split("Sugerencias:")
        diagnostico = partes[0].replace("Diagnóstico:", "").strip()
        sugerencias = [s.strip() for s in partes[1].split("\n") if s.strip() and not s.strip().isdigit()]

        return jsonify({
            "diagnostico": diagnostico,
            "sugerencias": sugerencias
        })
    except Exception as e:
        logging.error(f"Error en interpretar_codigos: {str(e)}")
        return jsonify({"error": str(e)}), 500


































# import logging
# from flask import Blueprint, request, jsonify
# from utils.openai_helper import obtener_respuesta_gpt, interpretar_codigos_error

# api = Blueprint('api', __name__)
# logging.basicConfig(level=logging.DEBUG)
# MAX_QUESTION_LENGTH = 150

# def generar_prompt_pregunta(data, historial):
#     """
#     Genera un prompt más enfocado para la obtención de preguntas de diagnóstico específicas., basado en la informacion y respuestas del usuario.
#     """
#     # Categorías de problemas comunes
#     categorias = ["motor", "transmisión", "frenos", "suspensión", "eléctrico", "sobrecalentamiento", "ruidos"]
#     problema = data.get('problema', 'No se proporcionó descripción del problema').lower()

#     # Identificar categoría del problema
#     categoria_detectada = next((cat for cat in categorias if cat in problema), "general")

#     prompt = f"""
#     Actúa como un experto en diagnóstico de coches. El vehículo es un {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} 
#     con motor de {data.get('combustible', 'desconocido')}. Presenta un problema relacionado con {categoria_detectada}. 

#     Basándote en el historial de diálogo y en el problema descrito, genera una pregunta precisa para obtener más detalles que ayuden a identificar la causa raíz. 
#     La pregunta debe ser específica y estar enfocada en descartar posibles fallos relacionados con {categoria_detectada}.

#     Historial de diálogo:
#     {historial}

#     Problema inicial descrito:
#     {problema}

#     La pregunta debe ser breve y clara (máximo {MAX_QUESTION_LENGTH} caracteres).
#     """
#     return prompt

# @api.route('/iniciar-diagnostico', methods=['POST'])
# def iniciar_diagnostico():
#     logging.debug(f"Received data: {request.json}")
#     data = request.json
#     try:
#         historial = []
#         prompt = generar_prompt_pregunta(data, historial)
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

#         if numero_pregunta <= 5:
#             prompt = generar_prompt_pregunta(data, historial)
#             siguiente_pregunta = obtener_respuesta_gpt(prompt)
#             logging.debug(f"Generated next question: {siguiente_pregunta}")
#             return jsonify({"pregunta": siguiente_pregunta[:MAX_QUESTION_LENGTH], "es_ultima": numero_pregunta == 10})
#         else:
#             # Diagnóstico final
#             prompt = f"""
#             Como experto en diagnóstico automotriz, realiza una evaluación final basada en la información recopilada.
#             Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

#             Información del vehículo: {info_vehiculo}
#             Historial de preguntas y respuestas: {historial}

#             Formato de respuesta:
#             Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
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


# @api.route('/interpretar-codigos', methods=['POST'])
# def interpretar_codigos():
#     logging.debug(f"Received data for code interpretation: {request.json}")
#     data = request.json
#     try:
#         codigos = data.get('codigos', [])
#         if not codigos:
#             return jsonify({"error": "No se proporcionaron códigos para interpretar"}), 400

#         interpretacion = interpretar_codigos_error(codigos)
#         logging.debug(f"Code interpretation result: {interpretacion}")
        
#         # Procesar la respuesta para extraer el diagnóstico y las sugerencias
#         partes = interpretacion.split("Sugerencias:")
#         diagnostico = partes[0].replace("Diagnóstico:", "").strip()
#         sugerencias = [s.strip() for s in partes[1].split("\n") if s.strip() and not s.strip().isdigit()]

#         return jsonify({
#             "diagnostico": diagnostico,
#             "sugerencias": sugerencias
#         })
#     except Exception as e:
#         logging.error(f"Error in interpretar_codigos: {str(e)}")
#         return jsonify({"error": str(e)}), 500



























