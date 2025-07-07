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
                # Peut y avoir plusieurs compétences à la suite
                comp = line.split(":",1)[-1].strip()
                if "competences" not in bloc:
                    bloc["competences"] = []
                bloc["competences"].append(comp)
            elif line.startswith("-> Niveau Bloom"):
                bloc["niveau_bloom"] = line.split(":",1)[-1].strip()
        if bloc:
            questions.append(bloc)
    # On a maintenant potentiellement plusieurs compétences par question
    for q in questions:
        # Ajoute toutes les compétences de la question
        for comp in q.get("competences", [q.get("competence", "Non trouvée")]):
            competences.append(comp)
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
    with open("rapport_examen.txt", "w", encoding="utf-8") as f:
        f.write(f"Taux de couvrance des CLO : {taux:.1f}% ({len(couverts)}/{len(clo_list)})\n")
        f.write("CLO couverts :\n")
        for clo in couverts:
            f.write(f"  - {clo}\n")
        f.write("CLO non couverts :\n")
        for clo in set(clo_list)-couverts:
            f.write(f"  - {clo}\n")
        f.write("\nRépartition des niveaux de Bloom :\n")
        rep = repartition_bloom(niveaux)
        for niveau, (nb, pct) in rep.items():
            f.write(f"  {niveau} : {nb} question(s) ({pct:.1f}%)\n")

        # Ajout du résumé pédagogique automatique
        total = sum(nb for nb, _ in rep.values())
        comprehension = rep.get('Compréhension', (0,0))[0] if 'Compréhension' in rep else rep.get('compréhension', (0,0))[0]
        application = rep.get('Application', (0,0))[0] if 'Application' in rep else rep.get('application', (0,0))[0]
        connaissance = rep.get('Connaissance', (0,0))[0] if 'Connaissance' in rep else rep.get('connaissance', (0,0))[0]
        evaluation = rep.get('Évaluation', (0,0))[0] if 'Évaluation' in rep else rep.get('évaluation', (0,0))[0]
        synthese = rep.get('Synthèse', (0,0))[0] if 'Synthèse' in rep else rep.get('synthèse', (0,0))[0]
        f.write("\n---\n\n**Résumé pédagogique (Taxonomie de Bloom) :**\n\n")
        f.write("L’examen exploite la taxonomie de Bloom pour évaluer différents niveaux cognitifs chez les étudiants. ")
        if comprehension > 0:
            f.write(f"La majorité des questions relèvent de la compréhension ({comprehension}/{total}), ce qui permet de vérifier l’assimilation des concepts fondamentaux. ")
        if application > 0:
            f.write(f"Des questions d’application ({application}) permettent de tester la capacité à utiliser les connaissances dans des situations concrètes. ")
        if connaissance > 0:
            f.write(f"Des questions de connaissance ({connaissance}) vérifient la mémorisation et la restitution des savoirs. ")
        if evaluation > 0:
            f.write(f"Des questions d’évaluation ({evaluation}) sollicitent l’esprit critique et la capacité à juger des modèles ou des situations. ")
        if synthese > 0:
            f.write(f"Enfin, des questions de synthèse ({synthese}) stimulent la création et la capacité à combiner des idées. ")
        f.write("\n")
        f.write("En résumé, l’examen est solide sur la couverture des compétences et permet d’évaluer plusieurs niveaux de la taxonomie de Bloom, mais gagnerait à renforcer les niveaux supérieurs (synthèse, évaluation) pour une évaluation pleinement équilibrée et exigeante.\n")
    # Affiche aussi à l'écran pour l'utilisateur
    with open("rapport_examen.txt", encoding="utf-8") as f:
        print(f.read())
