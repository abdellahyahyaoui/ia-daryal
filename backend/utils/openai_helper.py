from openai import OpenAI
import logging
from config import Config
 
client = OpenAI(api_key=Config.OPENAI_API_KEY)

def obtener_respuesta_gpt(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente experto en diagnóstico de vehículos."},
                {"role": "user", "content": prompt}
            ]
        )

        respuesta = response.choices[0].message.content.strip()
        return respuesta
    except Exception as e:
        logging.error(f"Error al obtener respuesta GPT: {str(e)}")
        raise


def interpretar_codigos_error(codigos):
    try:
        codigos_str = ", ".join(codigos)
        prompt = f"""
        Actúa como un experto en diagnóstico automotriz. Se te han proporcionado los siguientes códigos de error: {codigos_str}.
        Por favor, proporciona un diagnóstico detallado y sugerencias para resolver estos problemas.

        Tu respuesta debe tener el siguiente formato:
        Diagnóstico: [Un resumen conciso del problema o problemas indicados por los códigos ,Diagnóstico resumido en menos de 250 caracteres]
        Sugerencias:
        1. [Primera sugerencia breve para resolver el problema]
        2. [Segunda sugerencia breve para resolver el problema](si es aplicable)]

        
        Asegúrate de que el diagnóstico sea claro y las sugerencias sean prácticas y específicas.
        """

        return obtener_respuesta_gpt(prompt)
    except Exception as e:
        logging.error(f"Error al interpretar códigos: {str(e)}")
        raise






# from openai import OpenAI
# import logging
# from config import Config
 
# client = OpenAI(api_key=Config.OPENAI_API_KEY)

# def obtener_respuesta_gpt(prompt):
#     try:
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "Eres un asistente experto en diagnóstico de vehículos."},
#                 {"role": "user", "content": prompt}
#             ]
#         )
#         return response.choices[0].message.content.strip()
#     except Exception as e:
#         logging.error(f"Error al hacer la solicitud a la API: {str(e)}")
#         raise