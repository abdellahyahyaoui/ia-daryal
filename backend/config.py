import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

class Config:
    @staticmethod
    def get_openai_api_key():
        api_key = os.getenv("OPENAI_API_KEY_FROM_DOTENV") or os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("No OPENAI_API_KEY set for application")
            return None
        logger.debug("OPENAI_API_KEY loaded successfully")
        return api_key

api_key = Config.get_openai_api_key()

if api_key:
    print(f"API Key loaded: {api_key[:5]}...")
else:
    print("Warning: No OpenAI API key configured")
