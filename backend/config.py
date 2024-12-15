import os
from dotenv import load_dotenv
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

class Config:
    @staticmethod
    def get_openai_api_key():
        api_key = os.getenv("OPENAI_API_KEY_FROM_DOTENV") or os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("No OPENAI_API_KEY set for application")
            raise ValueError("No OPENAI_API_KEY set for application")
        logger.debug("OPENAI_API_KEY loaded successfully")
        return api_key

    OPENAI_API_KEY = get_openai_api_key()

print(f"API Key loaded: {Config.OPENAI_API_KEY[:5]}...") # Muestra solo los primeros 5 caracteres por seguridad

