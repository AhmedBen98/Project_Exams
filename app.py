from crud_utils import (
    init_db, add_prompt, get_prompts,
    add_examen, get_examens,
    add_question, get_questions,
    add_competence, get_competences,
    add_question_competence,
    delete_prompt, delete_examen, delete_question, delete_competence
)
from llm_utils import call_llm

def menu():
    print("\n--- Menu ---")
    print("1. Ajouter un prompt LLM")
    print("2. Afficher tous les prompts")
    print("3. Ajouter un examen")
    print("4. Afficher tous les examens")
    print("5. Ajouter une question à un examen")
    print("6. Afficher toutes les questions")
    print("7. Ajouter une compétence")
    print("8. Afficher toutes les compétences")
    print("9. Associer une question à une compétence")
    print("10. Supprimer un prompt")
    print("11. Supprimer un examen")
    print("12. Supprimer une question")
    print("13. Supprimer une compétence")
    print("0. Quitter")

def afficher_liste(titre, liste, colonnes):
    print(f"\n--- {titre} ---")
    print(" | ".join(colonnes))
    print("-" * 40)
    for row in liste:
        print(" | ".join(str(x) for x in row))
    print("-" * 40)

def main():
    init_db()
    while True:
        menu()
        choix = input("Votre choix : ")
        try:
            if choix == "1":
                prompt = input("Prompt : ")
                response = call_llm(prompt)
                add_prompt(prompt, response)
                print("Réponse LLM enregistrée.")
            elif choix == "2":
                prompts = get_prompts()
                afficher_liste("Prompts", prompts, ["ID", "Prompt", "Réponse"])
            elif choix == "3":
                nom = input("Nom de l'examen : ")
                date = input("Date (YYYY-MM-DD, optionnel) : ")
                add_examen(nom, date)
                print("Examen ajouté.")
            elif choix == "4":
                examens = get_examens()
                afficher_liste("Examens", examens, ["ID", "Nom", "Date"])
            elif choix == "5":
                examens = get_examens()
                afficher_liste("Examens", examens, ["ID", "Nom", "Date"])
                examen_id = int(input("ID de l'examen : "))
                texte = input("Texte de la question : ")
                niveau = input("Niveau de Bloom : ")
                add_question(examen_id, texte, niveau)
                print("Question ajoutée.")
            elif choix == "6":
                questions = get_questions()
                afficher_liste("Questions", questions, ["ID", "Examen_ID", "Texte", "Niveau Bloom"])
            elif choix == "7":
                texte = input("Texte de la compétence : ")
                add_competence(texte)
                print("Compétence ajoutée.")
            elif choix == "8":
                competences = get_competences()
                afficher_liste("Compétences", competences, ["ID", "Texte"])
            elif choix == "9":
                questions = get_questions()
                afficher_liste("Questions", questions, ["ID", "Examen_ID", "Texte", "Niveau Bloom"])
                question_id = int(input("ID de la question : "))
                competences = get_competences()
                afficher_liste("Compétences", competences, ["ID", "Texte"])
                competence_id = int(input("ID de la compétence : "))
                add_question_competence(question_id, competence_id)
                print("Association ajoutée.")
            elif choix == "10":
                prompts = get_prompts()
                afficher_liste("Prompts", prompts, ["ID", "Prompt", "Réponse"])
                prompt_id = int(input("ID du prompt à supprimer : "))
                delete_prompt(prompt_id)
                print("Prompt supprimé.")
            elif choix == "11":
                examens = get_examens()
                afficher_liste("Examens", examens, ["ID", "Nom", "Date"])
                examen_id = int(input("ID de l'examen à supprimer : "))
                delete_examen(examen_id)
                print("Examen supprimé.")
            elif choix == "12":
                questions = get_questions()
                afficher_liste("Questions", questions, ["ID", "Examen_ID", "Texte", "Niveau Bloom"])
                question_id = int(input("ID de la question à supprimer : "))
                delete_question(question_id)
                print("Question supprimée.")
            elif choix == "13":
                competences = get_competences()
                afficher_liste("Compétences", competences, ["ID", "Texte"])
                competence_id = int(input("ID de la compétence à supprimer : "))
                delete_competence(competence_id)
                print("Compétence supprimée.")
            elif choix == "0":
                print("Au revoir !")
                break
            else:
                print("Choix invalide.")
        except Exception as e:
            print(f"Erreur : {e}")

if __name__ == "__main__":
    main()