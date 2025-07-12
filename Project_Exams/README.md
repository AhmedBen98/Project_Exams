# Sujet 4 : Évaluation de la qualité des examens et adéquation avec les compétences visées (Taxonomie de Bloom)

## Structure proposée

- `extraction_competences.py` : Extraction des compétences (CLO) depuis un syllabus PDF
- `declinaison_examen_competences.py` : Association des questions d'examen aux compétences et niveaux de Bloom
- `bloom_taxonomy.py` : Outils pour la détection des niveaux de la taxonomie de Bloom

## Utilisation

### 1. Extraire les compétences du syllabus
```bash
python extraction_competences.py SYLLABUS_BGA_Deep\ Learning.pdf > competences.txt
```

### 2. Associer les questions d'un examen aux compétences et à la taxonomie de Bloom
```bash
python declinaison_examen_competences.py EXAM\ DEEP\ 2024.pdf competences.txt
```

## Dépendances
- pdfplumber

Installez-les avec :
```bash
pip install pdfplumber
```
