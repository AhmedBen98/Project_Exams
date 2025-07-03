"""
Utilitaire pour interroger un LLM via API (llama-3.3-70b-versatile)
"""
import os
import requests

API_URL = "https://api.groq.com/openai/v1/chat/completions"
# API_KEY should be set as an environment variable for security reasons
API_KEY = os.getenv("GROQ_API_KEY", "YOUR_API_KEY_HERE")
MODEL = "llama-3.3-70b-versatile"

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
