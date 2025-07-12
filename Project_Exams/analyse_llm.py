"""
Analyse qualitative automatique de l'examen par LLM
"""
import sys
from llm_utils import call_llm

def lire_rapport(rapport_path):
    with open(rapport_path, encoding="utf-8") as f:
        return f.read()

def analyse_par_llm(rapport):
    prompt = (
        "Voici un rapport d'évaluation d'un examen universitaire (taux de couverture des compétences, répartition des niveaux de Bloom, analyse qualitative). "
        "Analyse ce rapport en tant qu'expert pédagogique : donne un avis global, liste les points forts, les points faibles, et propose des recommandations concrètes pour améliorer la qualité de l'examen. Sois synthétique et structuré.\n\nRapport :\n" + rapport
    )
    return call_llm(prompt, max_tokens=2048)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyse_llm.py <rapport_examen.txt>")
        sys.exit(1)
    rapport = lire_rapport(sys.argv[1])
    analyse = analyse_par_llm(rapport)
    print("\n--- Analyse LLM ---\n")
    print(analyse)
    with open("analyse_llm.txt", "w", encoding="utf-8") as f:
        f.write(analyse)
