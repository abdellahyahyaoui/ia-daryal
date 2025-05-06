from openai import OpenAI
import logging
from config import Config
import httpx

# Configuración de logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

try:
    # Crear un cliente HTTP personalizado sin configuración de proxy
    http_client = httpx.Client(
        timeout=httpx.Timeout(60.0),
        follow_redirects=True
    )
    
    # Inicializar el cliente OpenAI con el cliente HTTP personalizado
    client = OpenAI(
        api_key=Config.get_openai_api_key(),
        http_client=http_client
    )
    logger.info("Cliente OpenAI inicializado correctamente")
except ValueError as e:
    logger.error(f"Error al inicializar el cliente OpenAI: {str(e)}")
    raise

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
        logger.error(f"Error al obtener respuesta GPT: {str(e)}")
        raise

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

        return obtener_respuesta_gpt(prompt)
    except Exception as e:
        logger.error(f"Error al interpretar códigos: {str(e)}")
        raise

# Prueba de funcionamiento
if __name__ == "__main__":
    try:
        respuesta = obtener_respuesta_gpt("¿Cuáles son los síntomas comunes de un problema en el alternador?")
        print("Respuesta:", respuesta)
    except Exception as e:
        print(f"Error al ejecutar la prueba: {str(e)}")




