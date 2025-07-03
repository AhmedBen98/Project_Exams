"""
Évaluation de la qualité d'un examen :
- Taux de couvrance des CLO (compétences)
- Répartition des niveaux de Bloom
"""
import sys
from collections import Counter

def lire_associations(fichier):
    questions = []
    competences = []
    niveaux = []
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
                bloc["competence"] = line.split(":",1)[-1].strip()
            elif line.startswith("-> Niveau Bloom"):
                bloc["niveau_bloom"] = line.split(":",1)[-1].strip()
        if bloc:
            questions.append(bloc)
    for q in questions:
        competences.append(q.get("competence","Non trouvée"))
        niveaux.append(q.get("niveau_bloom","Inconnu"))
    return questions, competences, niveaux

def taux_couvrance_clo(competences, fichier_clo):
    with open(fichier_clo, encoding="utf-8") as f:
        clo_list = [line.strip() for line in f if line.strip()]
    total_clo = len(clo_list)
    couverts = set()
    for clo in clo_list:
        for c in competences:
            if clo in c:
                couverts.add(clo)
                break
    taux = 100 * len(couverts) / total_clo if total_clo else 0
    return taux, couverts, clo_list

def repartition_bloom(niveaux):
    total = len(niveaux)
    count = Counter(niveaux)
    return {k: (v, 100*v/total if total else 0) for k,v in count.items()}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python eval_examen.py <output_questions_competences.txt> <competences.txt>")
        sys.exit(1)
    fichier_assoc = sys.argv[1]
    fichier_clo = sys.argv[2]
    questions, competences, niveaux = lire_associations(fichier_assoc)
    taux, couverts, clo_list = taux_couvrance_clo(competences, fichier_clo)
    print(f"Taux de couvrance des CLO : {taux:.1f}% ({len(couverts)}/{len(clo_list)})")
    print("CLO couverts :")
    for clo in couverts:
        print(f"  - {clo}")
    print("CLO non couverts :")
    for clo in set(clo_list)-couverts:
        print(f"  - {clo}")
    print("\nRépartition des niveaux de Bloom :")
    rep = repartition_bloom(niveaux)
    for niveau, (nb, pct) in rep.items():
        print(f"  {niveau} : {nb} question(s) ({pct:.1f}%)")
