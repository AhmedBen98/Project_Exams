"""
Utilitaire pour interroger un LLM via API (llama-3.3-70b-versatile)
"""
import requests
import os
from dotenv import load_dotenv


# Charger le .env (assure-toi que le fichier .env est à la racine de ton projet)
load_dotenv()

# Récupérer les variables d'environnement
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")
 
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
 
def call_llm(prompt, max_tokens=512, temperature=0.2):
    data = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temperature
    }
    response = requests.post(API_URL, headers=HEADERS, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]
 
 