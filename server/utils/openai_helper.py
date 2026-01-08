import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def interpretar_codigos_error(codigos):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": f"Interpreta estos códigos OBD2: {codigos}"}]
    )
    return response.choices[0].message.content

def analizar_media_vision(file_path):
    # Implementación de visión
    return "Análisis visual completado"