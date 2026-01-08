import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    @staticmethod
    def get_openai_api_key():
        return os.getenv("OPENAI_API_KEY")