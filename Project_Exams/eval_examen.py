import sys
import json
from collections import Counter
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_clo_texts_from_indexes(competence_indexes, clo_list):
    """Retourne les CLO correspondants à une liste d'indexes ou d'étiquettes ('1', '2', ...) ou de phrases"""
    matched = []
    for comp in competence_indexes:
        # Tente de matcher si la compétence est "1" (ou "2"...)
        if comp.isdigit():
            idx = int(comp) - 1
            if 0 <= idx < len(clo_list):
                matched.append(clo_list[idx])
        else:
            # Sinon, cherche la phrase exacte (ou sous-texte)
            for clo in clo_list:
                if comp.strip().lower() in clo.strip().lower() or clo.strip().lower() in comp.strip().lower():
                    matched.append(clo)
    return matched

def taux_couvrance_clo(questions, clo_list):
    # Trouver toutes les compétences associées à toutes les questions (sous forme d'index ou de texte)
    couverts = set()
    for q in questions:
        competences = q.get("competences") or [q.get("competence", "Non trouvée")]
        if isinstance(competences, str):
            competences = [competences]
        matched_clos = get_clo_texts_from_indexes(competences, clo_list)
        couverts.update(matched_clos)
    taux = 100 * len(couverts) / len(clo_list) if clo_list else 0
    return taux, couverts, clo_list

def repartition_bloom(questions):
    niveaux = []
    for q in questions:
        niveaux.append(q.get("niveau_bloom", "Inconnu"))
    total = len(niveaux)
    count = Counter(niveaux)
    return {k: (v, 100*v/total if total else 0) for k, v in count.items()}

def fix_utf8(s):
    # Corrige les éventuels problèmes d'encodage des textes
    try:
        return s.encode('latin1').decode('utf-8')
    except Exception:
        return s

def eval_from_json(data):
    questions = data["questions"]
    clo_list = [fix_utf8(c) for c in data["clo"]]

    taux, couverts, clo_list = taux_couvrance_clo(questions, clo_list)
    rep = repartition_bloom(questions)

    # Résumé pédagogique
    total = sum(nb for nb, _ in rep.values())
    comprehension = rep.get('Compréhension', (0,0))[0] if 'Compréhension' in rep else rep.get('compréhension', (0,0))[0]
    application = rep.get('Application', (0,0))[0] if 'Application' in rep else rep.get('application', (0,0))[0]
    connaissance = rep.get('Connaissance', (0,0))[0] if 'Connaissance' in rep else rep.get('connaissance', (0,0))[0]
    evaluation = rep.get('Évaluation', (0,0))[0] if 'Évaluation' in rep else rep.get('évaluation', (0,0))[0]
    synthese = rep.get('Synthèse', (0,0))[0] if 'Synthèse' in rep else rep.get('synthèse', (0,0))[0]

    resume = []
    resume.append("L’examen exploite la taxonomie de Bloom pour évaluer différents niveaux cognitifs chez les étudiants.")
    if comprehension > 0:
        resume.append(f"La majorité des questions relèvent de la compréhension ({comprehension}/{total}), ce qui permet de vérifier l’assimilation des concepts fondamentaux.")
    if application > 0:
        resume.append(f"Des questions d’application ({application}) permettent de tester la capacité à utiliser les connaissances dans des situations concrètes.")
    if connaissance > 0:
        resume.append(f"Des questions de connaissance ({connaissance}) vérifient la mémorisation et la restitution des savoirs.")
    if evaluation > 0:
        resume.append(f"Des questions d’évaluation ({evaluation}) sollicitent l’esprit critique et la capacité à juger des modèles ou des situations.")
    if synthese > 0:
        resume.append(f"Enfin, des questions de synthèse ({synthese}) stimulent la création et la capacité à combiner des idées.")
    resume.append("En résumé, l’examen est solide sur la couverture des compétences et permet d’évaluer plusieurs niveaux de la taxonomie de Bloom, mais gagnerait à renforcer les niveaux supérieurs (synthèse, évaluation) pour une évaluation pleinement équilibrée et exigeante.")

    output = {
        "taux_couvrance_clo": taux,
        "clo_couverts": list(couverts),
        "clo_non_couverts": list(set(clo_list)-couverts),
        "repartition_bloom": rep,
        "resume_pedagogique": " ".join(resume),
        "questions": questions
    }
    print(json.dumps(output, ensure_ascii=False))

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--json":
        data = json.load(sys.stdin)
        eval_from_json(data)
        sys.exit(0)
