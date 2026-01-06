from dotenv import load_dotenv
import os

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Imprimir el valor de la variable de entorno OPENAI_API_KEY
print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
