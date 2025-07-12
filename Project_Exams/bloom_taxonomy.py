"""
Outils pour la taxonomie de Bloom : classification des verbes et niveaux cognitifs
"""

BLOOM_LEVELS = {
    "connaissance": ["définir", "lister", "nommer", "identifier", "reconnaître", "rappeler"],
    "compréhension": ["expliquer", "résumer", "interpréter", "prédire", "décrire"],
    "application": ["utiliser", "appliquer", "démontrer", "illustrer", "résoudre"],
    "analyse": ["analyser", "différencier", "organiser", "structurer", "comparer"],
    "synthèse": ["créer", "composer", "planifier", "concevoir", "formuler"],
    "évaluation": ["évaluer", "juger", "justifier", "critiquer", "valider"]
}

def detecter_niveau_bloom(question):
    """
    Détecte le niveau de Bloom d'une question à partir des verbes utilisés.
    """
    question = question.lower()
    for niveau, verbes in BLOOM_LEVELS.items():
        for verbe in verbes:
            if verbe in question:
                return niveau
    return "inconnu"
