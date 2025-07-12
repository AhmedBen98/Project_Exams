"""
Script de déclinaison d'une proposition d'examen en compétences (taxonomie de Bloom)
Entrée : fichier PDF ou texte du sujet d'examen
Sortie : association questions <-> compétences
"""

import sys
import json
from bloom_taxonomy import detecter_niveau_bloom
import pdfplumber
from llm_utils import call_llm
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def _extraire_questions_llm(texte_total):
    """
    Utilise le LLM pour extraire les questions du texte d'examen.
    """
    prompt = (
        "Voici le texte d'un sujet d'examen universitaire. "
        "Extrais uniquement la liste des questions d'examen, une par ligne, sans autre texte ni explication.\n\n" + texte_total
    )
    try:
        reponse = call_llm(prompt, max_tokens=1024)
        questions = [q.strip() for q in reponse.split("\n") if q.strip()]
        return questions
    except Exception as e:
        print(f"Erreur LLM : {e}\nExtraction par heuristique...")
        return []

def _extraire_questions_heuristique(texte_total):
    """
    Extraction heuristique des questions à partir du texte total.
    """
    lignes = texte_total.split("\n")
    questions = []
    question = ""
    for ligne in lignes:
        if ligne.strip().lower().startswith("question") or ligne.strip().startswith(tuple(str(i) for i in range(1, 21))):
            if question:
                questions.append(question.strip())
            question = ligne
        else:
            question += " " + ligne
    if question:
        questions.append(question.strip())
    return questions

def extraire_questions(fichier_examen, use_llm=True):
    """
    Extrait les questions d'un sujet d'examen PDF.
    Si use_llm=True, utilise le LLM pour une extraction intelligente.
    """
    texte_total = ""
    with pdfplumber.open(fichier_examen) as pdf:
        for page in pdf.pages:
            texte = page.extract_text()
            if texte:
                texte_total += texte + "\n"

    questions = []
    if use_llm:
        questions = _extraire_questions_llm(texte_total)

    if not questions:
        questions = _extraire_questions_heuristique(texte_total)
    return questions

def _parse_bloc_llm(bloc):
    """
    Parse un bloc de texte LLM pour extraire question, compétence et niveau Bloom.
    """
    bloc_dict = {}
    for line in bloc.strip().split("\n"):
        if line.lower().startswith("question"):
            bloc_dict["question"] = line.split(":",1)[-1].strip()
        elif line.lower().startswith("compétence") or line.lower().startswith("compétences"):
            comp_str = line.split(":",1)[-1].strip()
            comps = [c.strip() for c in comp_str.split(",") if c.strip()]
            bloc_dict["competences"] = comps if comps else ["Non trouvée"]
        elif line.lower().startswith("niveau bloom"):
            bloc_dict["niveau_bloom"] = line.split(":",1)[-1].strip()
    if "question" in bloc_dict:
        if "competences" not in bloc_dict:
            bloc_dict["competences"] = ["Non trouvée"]
        if "niveau_bloom" not in bloc_dict:
            bloc_dict["niveau_bloom"] = "Inconnu"
        return bloc_dict
    return None

def _associer_questions_llm(questions, liste_competences):
    """
    Utilise le LLM pour associer chaque question à une compétence et un niveau de Bloom.
    """
    prompt = (
        "Voici une liste de questions d'examen et une liste de compétences (CLO). "
        "Pour chaque question, associe toutes les compétences pertinentes (CLO) – pas seulement la meilleure – et indique le niveau de la taxonomie de Bloom (connaissance, compréhension, application, analyse, synthèse, évaluation). "
        "Si plusieurs compétences sont pertinentes, liste-les séparées par une virgule. "
        "Réponds sous la forme :\n---\nQuestion : ...\nCompétences : ...\nNiveau Bloom : ...\n---\n\nQuestions :\n" + "\n".join(questions) + "\n\nCompétences :\n" + "\n".join(liste_competences)
    )
    associations = []
    try:
        reponse = call_llm(prompt, max_tokens=2048)
        blocs = reponse.split('---')
        for bloc in blocs:
            bloc_dict = _parse_bloc_llm(bloc)
            if bloc_dict:
                associations.append(bloc_dict)
    except Exception as e:
        print(f"Erreur LLM : {e}\nAssociation heuristique...")
    return associations

def _associer_questions_heuristique(questions, liste_competences):
    """
    Associe chaque question à une compétence et un niveau de Bloom par heuristique.
    """
    associations = []
    for question in questions:
        niveau_bloom = detecter_niveau_bloom(question)
        competence_associee = None
        for comp in liste_competences:
            if comp.lower().split(":")[0] in question.lower():
                competence_associee = comp
                break
        associations.append({
            "question": question,
            "niveau_bloom": niveau_bloom,
            "competence": competence_associee or "Non trouvée"
        })
    return associations

def associer_questions_competences(fichier_examen, liste_competences, use_llm=True):
    """
    Associe chaque question à une compétence et à un niveau de Bloom.
    Si use_llm=True, utilise le LLM pour une association intelligente.
    """
    questions = extraire_questions(fichier_examen, use_llm=use_llm)
    associations = []
    if use_llm:
        associations = _associer_questions_llm(questions, liste_competences)
    if not associations:
        associations = _associer_questions_heuristique(questions, liste_competences)
    return associations

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python declinaison_examen_competences.py <fichier_examen> <fichier_competences> [output_file]")
        sys.exit(1)
    fichier_examen = sys.argv[1]
    fichier_competences = sys.argv[2]
    output_file = sys.argv[3] if len(sys.argv) > 3 else "output_questions_competences.txt"
    # Charger la liste des compétences depuis un fichier texte (une compétence par ligne)
    with open(fichier_competences, encoding="utf-8") as f:
        liste_competences = [ligne.strip() for ligne in f if ligne.strip()]
    associations = associer_questions_competences(fichier_examen, liste_competences, use_llm=True)
    with open(output_file, "w", encoding="utf-8") as out:
        for assoc in associations:
            question = assoc.get("question", "[Question manquante]")
            competences = assoc.get("competences") or [assoc.get("competence", "Non trouvée")]
            niveau_bloom = assoc.get("niveau_bloom", "Inconnu")
            if not question or not competences or not niveau_bloom:
                out.write(f"[ERREUR] Association mal formée : {assoc}\n\n")
                continue
            out.write(f"Question : {question}\n")
            for comp in competences:
                out.write(f"  -> Compétence : {comp}\n")
            out.write(f"  -> Niveau Bloom : {niveau_bloom}\n\n")
    # print(f"Résultat écrit dans {output_file}")
    print(json.dumps({"questions": associations}, ensure_ascii=False))
