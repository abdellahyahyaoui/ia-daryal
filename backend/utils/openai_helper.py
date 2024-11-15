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
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error al hacer la solicitud a la API: {str(e)}")
        raise