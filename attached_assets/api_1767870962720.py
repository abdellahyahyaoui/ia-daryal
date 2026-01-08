# from flask import Blueprint, request, jsonify
# from utils.openai_helper import obtener_respuesta_gpt, interpretar_codigos_error
# import logging

# # Configuración de la API y logger
# api = Blueprint('api', __name__)
# logging.basicConfig(level=logging.DEBUG)

# # Constantes
# MAX_QUESTION_LENGTH = 150
# MAX_PREGUNTAS = 5
# CATEGORIAS_PROBLEMAS = [
#     "motor", "transmisión", "frenos", "suspensión", "eléctrico", "sobrecalentamiento", 
#     "ruidos", "batería", "dirección", "climatización", "sistemas de escape", 
#     "consumo de combustible", "luces", "neumáticos", "sensores", "puertas", 
#     "ventanas", "parabrisas", "sistemas de seguridad", "airbags", "cámara de reversa", 
#     "sistema de infoentretenimiento", "sistema de arranque", "fugas de fluidos", 
#     "transmisión automática", "transmisión manual", "embrague", "calefacción", 
#     "refrigeración", "sistemas de control de tracción", "freno de mano", 
#     "dirección asistida", "problemas electrónicos generales", "vibraciones"
# ]

# # Categorías específicas para vehículos eléctricos
# CATEGORIAS_PROBLEMAS_ELECTRICOS = [
#     "batería", "autonomía", "carga", "motor eléctrico", "sistema de refrigeración", 
#     "controlador", "inversor", "BMS", "regeneración", "conectores", "cableado", 
#     "sistema de alta tensión", "sistema de baja tensión", "cargador a bordo", 
#     "puerto de carga", "display", "software", "actualizaciones", "celdas", 
#     "temperatura de batería", "eficiencia energética", "frenado regenerativo"
# ]

# def validar_datos(data, campos_requeridos):
#     """
#     Valida que los datos proporcionados contengan los campos requeridos.
#     """
#     errores = [campo for campo in campos_requeridos if campo not in data]
#     if errores:
#         return False, f"Faltan los siguientes campos: {', '.join(errores)}"
#     return True, None

# def generar_prompt_pregunta(data, historial):
#     """
#     Genera un prompt enfocado para obtener preguntas específicas de diagnóstico, basado en 
#     la información y respuestas previas del usuario. Mejora el contexto y la claridad de las preguntas.
#     """
#     problema = data.get('problema', 'No se proporcionó descripción del problema').lower()
    
#     # Determinar el tipo de vehículo
#     tipo_vehiculo = data.get('tipo_vehiculo', 'coche')
    
#     # Seleccionar categorías de problemas según el tipo de vehículo
#     if 'eléctrico' in tipo_vehiculo:
#         categorias = CATEGORIAS_PROBLEMAS + CATEGORIAS_PROBLEMAS_ELECTRICOS
#     else:
#         categorias = CATEGORIAS_PROBLEMAS
    
#     categoria_detectada = next((cat for cat in categorias if cat in problema), "general")
    
#     # Construir la descripción del vehículo según su tipo
#     if tipo_vehiculo == 'coche':
#         descripcion_vehiculo = f"un {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} con motor de {data.get('combustible', 'desconocido')}"
#     elif tipo_vehiculo == 'coche eléctrico':
#         descripcion_vehiculo = f"un coche eléctrico {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} con autonomía de {data.get('autonomia', 'desconocida')}"
#     elif tipo_vehiculo == 'moto':
#         descripcion_vehiculo = f"una motocicleta {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} tipo {data.get('tipo_moto', 'desconocido')} del año {data.get('año', 'desconocido')} con motor de {data.get('combustible', 'desconocido')}"
#     elif tipo_vehiculo == 'moto eléctrica':
#         descripcion_vehiculo = f"una motocicleta eléctrica {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} tipo {data.get('tipo_moto', 'desconocido')} del año {data.get('año', 'desconocido')} con autonomía de {data.get('autonomia', 'desconocida')}"
#     elif tipo_vehiculo == 'patinete eléctrico':
#         descripcion_vehiculo = f"un patinete eléctrico {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} con autonomía de {data.get('autonomia', 'desconocida')}"
#     else:
#         descripcion_vehiculo = f"un vehículo {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')}"
    
#     prompt = f"""
#     Actúa como un experto en diagnóstico de vehículos. El vehículo es {descripcion_vehiculo}. 
#     Presenta un problema relacionado con {categoria_detectada}. 

#     Basándote en el historial de diálogo y en el problema descrito, genera una pregunta precisa para obtener más detalles que ayuden a identificar la causa raíz. 
#     La pregunta debe ser específica y estar enfocada en descartar posibles fallos relacionados con {categoria_detectada}.

#     Tu tarea es formular una pregunta específica que permita obtener más detalles sobre la causa raíz del problema, tomando en cuenta el historial de conversación, el contexto y la categoría identificada.
    
#     Historial de diálogo:
#     {historial}

#     La pregunta debe ser enfocada, breve y no exceder los {MAX_QUESTION_LENGTH} caracteres.
#     """
#     return prompt.strip()

# @api.route('/iniciar-diagnostico', methods=['POST'])
# def iniciar_diagnostico():
#     """
#     Inicia el diagnóstico generando la primera pregunta basada en la información inicial.
#     """
#     data = request.json
#     logging.debug(f"Received data: {data}")

#     # Validar campos requeridos básicos
#     campos_requeridos = ['problema', 'marca', 'modelo', 'año']
    
#     # Añadir campos específicos según el tipo de vehículo
#     tipo_vehiculo = data.get('tipo_vehiculo', 'coche')
#     if tipo_vehiculo == 'coche':
#         campos_requeridos.append('combustible')
#     elif tipo_vehiculo == 'coche eléctrico':
#         campos_requeridos.append('autonomia')
#     elif tipo_vehiculo == 'moto':
#         campos_requeridos.extend(['combustible', 'tipo_moto'])
#     elif tipo_vehiculo == 'moto eléctrica':
#         campos_requeridos.extend(['autonomia', 'tipo_moto'])
#     elif tipo_vehiculo == 'patinete eléctrico':
#         campos_requeridos.append('autonomia')
    
#     valido, error = validar_datos(data, campos_requeridos)
#     if not valido:
#         return jsonify({"error": error}), 400

#     try:
#         historial = []
#         prompt = generar_prompt_pregunta(data, historial)
#         pregunta = obtener_respuesta_gpt(prompt)
#         logging.debug(f"Generated question: {pregunta}")
#         return jsonify({"pregunta": pregunta[:MAX_QUESTION_LENGTH]})
#     except Exception as e:
#         logging.error(f"Error in iniciar_diagnostico: {str(e)}")
#         return jsonify({"error": "Ocurrió un error al generar la pregunta inicial"}), 500

# @api.route('/continuar-diagnostico', methods=['POST'])
# def continuar_diagnostico():
#     """
#     Continúa el diagnóstico generando preguntas adicionales o el diagnóstico final.
#     """
#     data = request.json
#     logging.debug(f"Received data for continuation: {data}")

#     valido, error = validar_datos(data, ['historial', 'vehiculo'])
#     if not valido:
#         return jsonify({"error": error}), 400

#     try:
#         historial = data['historial']
#         numero_pregunta = len([item for item in historial if item['tipo'] == 'pregunta']) + 1

#         if numero_pregunta <= MAX_PREGUNTAS:
#             prompt = generar_prompt_pregunta(data['vehiculo'], historial)
#             siguiente_pregunta = obtener_respuesta_gpt(prompt)
#             logging.debug(f"Generated next question: {siguiente_pregunta}")
#             return jsonify({
#                 "pregunta": siguiente_pregunta[:MAX_QUESTION_LENGTH],
#                 "es_ultima": numero_pregunta == MAX_PREGUNTAS
#             })
#         else:
#             # Diagnóstico final
#             tipo_vehiculo = data['vehiculo'].get('tipo_vehiculo', 'coche')
            
#             if 'eléctrico' in tipo_vehiculo:
#                 if 'moto' in tipo_vehiculo:
#                     prompt = f"""
#                     Como experto en diagnóstico de motocicletas eléctricas, realiza una evaluación final basada en la información recopilada.
#                     Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

#                     Información del vehículo: {data['vehiculo']}
#                     Historial de preguntas y respuestas: {historial}

#                     Formato de respuesta:
#                     Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
#                     Soluciones:
#                     1. [Primera solución breve]
#                     2. [Segunda solución breve]
#                     3. [Tercera solución breve (opcional)]
#                     """
#                 elif 'patinete' in tipo_vehiculo:
#                     prompt = f"""
#                     Como experto en diagnóstico de patinetes eléctricos, realiza una evaluación final basada en la información recopilada.
#                     Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

#                     Información del vehículo: {data['vehiculo']}
#                     Historial de preguntas y respuestas: {historial}

#                     Formato de respuesta:
#                     Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
#                     Soluciones:
#                     1. [Primera solución breve]
#                     2. [Segunda solución breve]
#                     3. [Tercera solución breve (opcional)]
#                     """
#                 else:
#                     prompt = f"""
#                     Como experto en diagnóstico de coches eléctricos, realiza una evaluación final basada en la información recopilada.
#                     Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

#                     Información del vehículo: {data['vehiculo']}
#                     Historial de preguntas y respuestas: {historial}

#                     Formato de respuesta:
#                     Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
#                     Soluciones:
#                     1. [Primera solución breve]
#                     2. [Segunda solución breve]
#                     3. [Tercera solución breve (opcional)]
#                     """
#             elif tipo_vehiculo == 'moto':
#                 prompt = f"""
#                 Como experto en diagnóstico de motocicletas, realiza una evaluación final basada en la información recopilada.
#                 Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

#                 Información del vehículo: {data['vehiculo']}
#                 Historial de preguntas y respuestas: {historial}

#                 Formato de respuesta:
#                 Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
#                 Soluciones:
#                 1. [Primera solución breve]
#                 2. [Segunda solución breve]
#                 3. [Tercera solución breve (opcional)]
#                 """
#             else:
#                 prompt = f"""
#                 Como experto en diagnóstico automotriz, realiza una evaluación final basada en la información recopilada.
#                 Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

#                 Información del vehículo: {data['vehiculo']}
#                 Historial de preguntas y respuestas: {historial}

#                 Formato de respuesta:
#                 Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres]
#                 Soluciones:
#                 1. [Primera solución breve]
#                 2. [Segunda solución breve]
#                 3. [Tercera solución breve (opcional)]
#                 """
#             respuesta_final = obtener_respuesta_gpt(prompt)
#             logging.debug(f"Generated final diagnosis and solutions: {respuesta_final}")
#             return jsonify({"diagnostico_y_soluciones": respuesta_final})
#     except Exception as e:
#         logging.error(f"Error in continuar_diagnostico: {str(e)}")
#         return jsonify({"error": "Ocurrió un error al continuar el diagnóstico"}), 500

# @api.route('/interpretar-codigos', methods=['POST'])
# def interpretar_codigos():
#     """
#     Interpreta los códigos de error del vehículo y genera sugerencias.
#     """
#     data = request.json
#     logging.debug(f"Received data for code interpretation: {data}")

#     try:
#         codigos = data.get('codigos', [])
#         if not codigos:
#             return jsonify({"error": "No se proporcionaron códigos para interpretar"}), 400

#         interpretacion = interpretar_codigos_error(codigos)
#         logging.debug(f"Code interpretation result: {interpretacion}")

#         partes = interpretacion.split("Sugerencias:")
#         diagnostico = partes[0].replace("Diagnóstico:", "").strip()
#         sugerencias = [s.strip() for s in partes[1].split("\n") if s.strip() and not s.strip().isdigit()]

#         return jsonify({
#             "diagnostico": diagnostico,
#             "sugerencias": sugerencias
#         })
#     except Exception as e:
#         logging.error(f"Error in interpretar_codigos: {str(e)}")
#         return jsonify({"error": "Ocurrió un error al interpretar los códigos"}), 500



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

# Categorías específicas para vehículos eléctricos
CATEGORIAS_PROBLEMAS_ELECTRICOS = [
    "batería", "autonomía", "carga", "motor eléctrico", "sistema de refrigeración", 
    "controlador", "inversor", "BMS", "regeneración", "conectores", "cableado", 
    "sistema de alta tensión", "sistema de baja tensión", "cargador a bordo", 
    "puerto de carga", "display", "software", "actualizaciones", "celdas", 
    "temperatura de batería", "eficiencia energética", "frenado regenerativo"
]

# Categorías específicas para bicicletas eléctricas
CATEGORIAS_PROBLEMAS_EBIKE = [
    "batería", "autonomía", "carga", "motor eléctrico", "display", "sensores", 
    "cadena", "cambios", "frenos", "ruedas", "neumáticos", "suspensión", 
    "luces", "cableado", "controlador", "pedaleo asistido", "modo turbo", 
    "sensor de pedaleo", "sensor de velocidad", "frenos hidráulicos", 
    "frenos mecánicos", "desviador", "cassette", "platos", "biela", 
    "horquilla", "amortiguador", "tija", "manillar", "potencia", "puños"
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
    
    # Determinar el tipo de vehículo
    tipo_vehiculo = data.get('tipo_vehiculo', 'coche')
    
    # Seleccionar categorías de problemas según el tipo de vehículo
    if 'bicicleta eléctrica' in tipo_vehiculo:
        categorias = CATEGORIAS_PROBLEMAS_EBIKE
    elif 'eléctrico' in tipo_vehiculo:
        categorias = CATEGORIAS_PROBLEMAS + CATEGORIAS_PROBLEMAS_ELECTRICOS
    else:
        categorias = CATEGORIAS_PROBLEMAS
    
    categoria_detectada = next((cat for cat in categorias if cat in problema), "general")
    
    # Construir la descripción del vehículo según su tipo
    if tipo_vehiculo == 'coche':
        descripcion_vehiculo = f"un {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} con motor de {data.get('combustible', 'desconocido')}"
    elif tipo_vehiculo == 'coche eléctrico':
        descripcion_vehiculo = f"un coche eléctrico {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} con autonomía de {data.get('autonomia', 'desconocida')}"
    elif tipo_vehiculo == 'moto':
        descripcion_vehiculo = f"una motocicleta {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} tipo {data.get('tipo_moto', 'desconocido')} del año {data.get('año', 'desconocido')} con motor de {data.get('combustible', 'desconocido')}"
    elif tipo_vehiculo == 'moto eléctrica':
        descripcion_vehiculo = f"una motocicleta eléctrica {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} tipo {data.get('tipo_moto', 'desconocido')} del año {data.get('año', 'desconocido')} con autonomía de {data.get('autonomia', 'desconocida')}"
    elif tipo_vehiculo == 'patinete eléctrico':
        descripcion_vehiculo = f"un patinete eléctrico {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')} con autonomía de {data.get('autonomia', 'desconocida')}"
    elif tipo_vehiculo == 'bicicleta eléctrica Orbea':
        descripcion_vehiculo = f"una bicicleta eléctrica Orbea {data.get('modelo', 'desconocido')} de categoría {data.get('categoria', 'desconocida')} del año {data.get('año', 'desconocido')} con motor {data.get('tipo_motor', 'desconocido')} y batería {data.get('tipo_bateria', 'desconocida')}"
    else:
        descripcion_vehiculo = f"un vehículo {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')} del año {data.get('año', 'desconocido')}"
    
    prompt = f"""
    Actúa como un experto en diagnóstico de vehículos. El vehículo es {descripcion_vehiculo}. 
    Presenta un problema relacionado con {categoria_detectada}. 

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

    # Validar campos requeridos básicos
    campos_requeridos = ['problema', 'marca', 'modelo', 'año']
    
    # Añadir campos específicos según el tipo de vehículo
    tipo_vehiculo = data.get('tipo_vehiculo', 'coche')
    if tipo_vehiculo == 'coche':
        campos_requeridos.append('combustible')
    elif tipo_vehiculo == 'coche eléctrico':
        campos_requeridos.append('autonomia')
    elif tipo_vehiculo == 'moto':
        campos_requeridos.extend(['combustible', 'tipo_moto'])
    elif tipo_vehiculo == 'moto eléctrica':
        campos_requeridos.extend(['autonomia', 'tipo_moto'])
    elif tipo_vehiculo == 'patinete eléctrico':
        campos_requeridos.append('autonomia')
    elif tipo_vehiculo == 'bicicleta eléctrica Orbea':
        campos_requeridos.extend(['categoria', 'tipo_motor', 'tipo_bateria'])
    
    valido, error = validar_datos(data, campos_requeridos)
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
            prompt = generar_prompt_pregunta(data['vehiculo'], historial)
            siguiente_pregunta = obtener_respuesta_gpt(prompt)
            logging.debug(f"Generated next question: {siguiente_pregunta}")
            return jsonify({
                "pregunta": siguiente_pregunta[:MAX_QUESTION_LENGTH],
                "es_ultima": numero_pregunta == MAX_PREGUNTAS
            })
        else:
            # Diagnóstico final
            tipo_vehiculo = data['vehiculo'].get('tipo_vehiculo', 'coche')
            
            if tipo_vehiculo == 'bicicleta eléctrica Orbea':
                prompt = f"""
                Como experto en diagnóstico de bicicletas eléctricas Orbea, realiza una evaluación final basada en la información recopilada.
                Considera las características específicas de las e-bikes Orbea, sus sistemas de motor (Bosch, Shimano, Ebikemotion, Mahle), 
                tipos de batería, y componentes específicos de ciclismo.
                
                Proporciona un diagnóstico resumido y sugiere 2-3 posibles soluciones para el problema.

                Información del vehículo: {data['vehiculo']}
                Historial de preguntas y respuestas: {historial}

                Formato de respuesta:
                Diagnóstico: [Diagnóstico resumido en menos de 250 caracteres, específico para e-bikes Orbea]
                Soluciones:
                1. [Primera solución breve enfocada en componentes de e-bike]
                2. [Segunda solución breve considerando sistemas Orbea]
                3. [Tercera solución breve (opcional) con recomendaciones de mantenimiento]
                """
            elif 'eléctrico' in tipo_vehiculo:
                if 'moto' in tipo_vehiculo:
                    prompt = f"""
                    Como experto en diagnóstico de motocicletas eléctricas, realiza una evaluación final basada en la información recopilada.
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
                elif 'patinete' in tipo_vehiculo:
                    prompt = f"""
                    Como experto en diagnóstico de patinetes eléctricos, realiza una evaluación final basada en la información recopilada.
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
                else:
                    prompt = f"""
                    Como experto en diagnóstico de coches eléctricos, realiza una evaluación final basada en la información recopilada.
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
            elif tipo_vehiculo == 'moto':
                prompt = f"""
                Como experto en diagnóstico de motocicletas, realiza una evaluación final basada en la información recopilada.
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
            else:
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

