"""
Remplace les indices de compétences par leur texte dans output_questions_competences.txt
"""
def charger_competences(fichier):
    comp_dict = {}
    with open(fichier, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if line:
                comp_dict[str(i)] = line
    return comp_dict

def remplacer_indices_par_textes(fichier_in, fichier_comp, fichier_out):
    comp_dict = charger_competences(fichier_comp)
    with open(fichier_in, encoding="utf-8") as fin, open(fichier_out, "w", encoding="utf-8") as fout:
        for line in fin:
            if line.strip().startswith("-> Compétence :"):
                idx = line.split(":",1)[-1].strip()
                texte = comp_dict.get(idx, idx)
                fout.write(f"  -> Compétence : {texte}\n")
            else:
                fout.write(line)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 4:
        print("Usage: python output_questions_competences_textes.py output_questions_competences.txt competences.txt output_questions_competences_textes.txt")
        exit(1)
    remplacer_indices_par_textes(sys.argv[1], sys.argv[2], sys.argv[3])
