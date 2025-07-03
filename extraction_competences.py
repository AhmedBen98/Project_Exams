"""
Script d'extraction des compétences à acquérir dans un module.
Entrée : fichier PDF ou texte décrivant le module
Sortie : liste des compétences extraites
"""

import sys

def extraire_texte_pdf(fichier_module):
    """
    Extrait le texte de toutes les pages d'un fichier PDF.
    """
    try:
        import pdfplumber
    except ImportError:
        print("Le module pdfplumber n'est pas installé. Installez-le avec 'pip install pdfplumber'.")
        return ""
    texte_total = ""
    with pdfplumber.open(fichier_module) as pdf:
        for page in pdf.pages:
            texte = page.extract_text()
            if texte:
                texte_total += texte + "\n"
    return texte_total

def extraction_par_mots_cles(texte_total):
    """
    Extrait les compétences par recherche de mots-clés dans le texte.
    """
    competences = []
    mots_cles = ["compétence", "CLO", "learning outcome", "objectif d'apprentissage", "outcome"]
    for ligne in texte_total.split("\n"):
        for mot in mots_cles:
            if mot.lower() in ligne.lower():
                competences.append(ligne.strip())
                break
    return competences

def extraire_competences(fichier_module, use_llm=True):
    """
    Extraction des compétences (CLO) depuis un fichier PDF de syllabus.
    Si use_llm=True, utilise le LLM pour une extraction intelligente.
    """
    texte_total = extraire_texte_pdf(fichier_module)
    competences = []

    if use_llm and texte_total:
        try:
            from llm_utils import call_llm
            prompt = (
                "Voici le texte d'un syllabus de module universitaire. "
                "Extrais uniquement la liste des compétences à acquérir (CLO, learning outcomes, objectifs d'apprentissage), "
                "une par ligne, sans autre texte ni explication.\n\n" + texte_total
            )
            reponse = call_llm(prompt, max_tokens=1024)
            competences = [line.strip() for line in reponse.split("\n") if line.strip()]
        except Exception as e:
            print(f"Erreur LLM : {e}\nExtraction par mots-clés...")

    if not competences and texte_total:
        competences = extraction_par_mots_cles(texte_total)

    return competences

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extraction_competences.py <fichier_module> [output_file]")
        sys.exit(1)
    fichier = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "output_competences.txt"
    competences = extraire_competences(fichier, use_llm=True)
    with open(output_file, "w", encoding="utf-8") as out:
        for c in competences:
            out.write(c + "\n")
    print(f"Compétences extraites écrites dans {output_file}")
