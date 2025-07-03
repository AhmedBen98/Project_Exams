# Script de test automatisé pour l'API FastAPI (auth, analyse, historique)
# Nécessite: requests
import requests

API_URL = "http://localhost:8000"
EMAIL = "testuser@example.com"
PASSWORD = "testpassword123"

# 1. Inscription
r = requests.post(f"{API_URL}/auth/register", json={"email": EMAIL, "password": PASSWORD})
print("Inscription:", r.status_code, r.text)

# 2. Connexion
r = requests.post(f"{API_URL}/auth/jwt/login", data={"username": EMAIL, "password": PASSWORD})
print("Connexion:", r.status_code, r.text)
token = r.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# 3. Analyse (nécessite syllabus.pdf et examen.pdf dans le dossier courant)
with open("syllabus.pdf", "rb") as s, open("examen.pdf", "rb") as e:
    files = {"syllabus": s, "exam": e}
    r = requests.post(f"{API_URL}/analyze", files=files, headers=headers)
    print("Analyse:", r.status_code)
    print(r.json())

# 4. Historique
r = requests.get(f"{API_URL}/history", headers=headers)
print("Historique:", r.status_code)
print(r.json())
