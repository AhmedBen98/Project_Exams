# Sujet 4 : Évaluation de la qualité des examens et adéquation avec les compétences visées (Taxonomie de Bloom)

## Structure proposée

- `extraction_competences.py` : Extraction des compétences (CLO) depuis un syllabus PDF
- `declinaison_examen_competences.py` : Association des questions d'examen aux compétences et niveaux de Bloom
- `bloom_taxonomy.py` : Outils pour la détection des niveaux de la taxonomie de Bloom
- `crud_utils.py` : Fonctions CRUD pour la gestion des prompts, examens, questions, compétences, associations
- `app.py` : Interface console pour gérer toutes les entités (CRUD complet)

## Utilisation

### 1. Extraire les compétences du syllabus
```bash
python extraction_competences.py SYLLABUS_BGA_Deep\ Learning.pdf > competences.txt
```

### 2. Associer les questions d'un examen aux compétences et à la taxonomie de Bloom
```bash
python declinaison_examen_competences.py EXAM\ DEEP\ 2024.pdf competences.txt
```

### 3. Utiliser le CRUD via l'application console
Lancez l'application principale pour gérer prompts, examens, questions, compétences, et leurs associations :
```bash
python app.py
```

Vous aurez accès à un menu interactif permettant :
- Ajouter, afficher, supprimer un prompt LLM
- Ajouter, afficher, supprimer un examen
- Ajouter, afficher, supprimer une question
- Ajouter, afficher, supprimer une compétence
- Associer une question à une compétence

Exemple d'utilisation :
- Ajouter un examen, puis des questions à cet examen
- Associer chaque question à une ou plusieurs compétences
- Supprimer une entité si besoin (prompt, examen, question, compétence)

## Dépendances
- pdfplumber

Installez-les avec :
```bash
pip install pdfplumber
```

Autres dépendances :
- requests (pour l'appel LLM)

```bash
pip install requests
```

## Remarque
Le fichier `crud_utils.py` contient toutes les fonctions nécessaires pour manipuler la base de données (SQLite) utilisée par l'application. Le fichier `app.py` fournit une interface utilisateur simple pour exploiter ces fonctionnalités CRUD.
