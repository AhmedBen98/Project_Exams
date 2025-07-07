"""
Analyse détaillée des associations question <-> compétences <-> Bloom
"""
from collections import Counter

def lire_associations_detaillees(fichier):
    questions = []
    with open(fichier, encoding="utf-8") as f:
        bloc = {}
        for line in f:
            line = line.strip()
            if line.startswith("Question :"):
                if bloc:
                    questions.append(bloc)
                    bloc = {}
                bloc["question"] = line.split(":",1)[-1].strip()
            elif line.startswith("-> Compétence"):
                comp = line.split(":",1)[-1].strip()
                if "competences" not in bloc:
                    bloc["competences"] = []
                bloc["competences"].append(comp)
            elif line.startswith("-> Niveau Bloom"):
                bloc["niveau_bloom"] = line.split(":",1)[-1].strip()
        if bloc:
            questions.append(bloc)
    return questions

def analyse_detaillee(fichier):
    questions = lire_associations_detaillees(fichier)
    print("\n=== Analyse détaillée par question ===\n")
    for i, q in enumerate(questions, 1):
        print(f"Q{i}: {q.get('question','[?]')}")
        print(f"  Compétences : {', '.join(q.get('competences', ['Non trouvée']))}")
        print(f"  Niveau Bloom : {q.get('niveau_bloom','Inconnu')}")
        print()
    # Statistiques globales
    all_comp = [c for q in questions for c in q.get('competences',[])]
    all_bloom = [q.get('niveau_bloom','Inconnu') for q in questions]
    print("\n=== Statistiques globales ===\n")
    print("Nombre de questions :", len(questions))
    print("\nQuestions par compétence :")
    for comp, nb in Counter(all_comp).most_common():
        print(f"  {comp} : {nb}")
    print("\nQuestions par niveau de Bloom :")
    for bloom, nb in Counter(all_bloom).most_common():
        print(f"  {bloom} : {nb}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python analyse_questions_detaillee.py <output_questions_competences.txt>")
        exit(1)
    analyse_detaillee(sys.argv[1])
