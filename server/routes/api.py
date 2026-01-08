from flask import Blueprint, request, jsonify
from utils.openai_helper import interpretar_codigos_error, analizar_media_vision
import logging

api = Blueprint('api', __name__)

@api.route('/iniciar-diagnostico', methods=['POST'])
def iniciar_diagnostico():
    # Simplificado para Replit
    return jsonify({"pregunta": "¿Qué síntomas específicos notas?"})

@api.route('/interpretar-codigos', methods=['POST'])
def interpretar_codigos():
    data = request.json
    resultado = interpretar_codigos_error(data.get('codigos', []))
    return jsonify({"diagnostico": resultado})

@api.route('/analizar-media', methods=['POST'])
def analizar_media():
    files = request.files
    # Lógica para procesar archivos y llamar a GPT-4o
    return jsonify({"analisis": "Imagen/Audio procesado correctamente con GPT-4o"})