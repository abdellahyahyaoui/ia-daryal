import fitz  # PyMuPDF
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from config import api_key
import os

def extract_specs_from_text(text):
    """
    Usa LLM para extraer especificaciones técnicas clave de un texto.
    """
    from utils.openai_helper import obtener_respuesta_gpt
    prompt = f"Extrae marca, modelo, año, motor, potencia, y tipo de combustible del siguiente texto técnico. Si no lo encuentras, indica 'No encontrado'. Texto: {text[:2000]}"
    return obtener_respuesta_gpt(prompt)

def process_tech_sheet(file_path):
    """
    Extrae texto de una ficha técnica (PDF o imagen).
    """
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error procesando ficha: {e}")
        return None

def query_manual(vectorstore, query):
    if not vectorstore:
        return ""
    docs = vectorstore.similarity_search(query, k=2)
    return "\n".join([doc.page_content for doc in docs])
