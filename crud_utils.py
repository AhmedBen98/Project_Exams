import sqlite3

DB_PATH = "prompts.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Table prompts
    c.execute("""
        CREATE TABLE IF NOT EXISTS prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT NOT NULL,
            response TEXT NOT NULL
        )
    """)
    # Table examens
    c.execute("""
        CREATE TABLE IF NOT EXISTS examens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            date TEXT
        )
    """)
    # Table questions
    c.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            examen_id INTEGER,
            texte TEXT NOT NULL,
            niveau_bloom TEXT,
            FOREIGN KEY (examen_id) REFERENCES examens(id)
        )
    """)
    # Table competences
    c.execute("""
        CREATE TABLE IF NOT EXISTS competences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            texte TEXT NOT NULL
        )
    """)
    # Table association question <-> competence
    c.execute("""
        CREATE TABLE IF NOT EXISTS question_competence (
            question_id INTEGER,
            competence_id INTEGER,
            FOREIGN KEY (question_id) REFERENCES questions(id),
            FOREIGN KEY (competence_id) REFERENCES competences(id)
        )
    """)
    conn.commit()
    conn.close()

# CRUD Prompts
def add_prompt(prompt, response):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO prompts (prompt, response) VALUES (?, ?)", (prompt, response))
    conn.commit()
    conn.close()

def get_prompts():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, prompt, response FROM prompts")
    rows = c.fetchall()
    conn.close()
    return rows

def delete_prompt(prompt_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM prompts WHERE id=?", (prompt_id,))
    conn.commit()
    conn.close()

# CRUD Examens
def add_examen(nom, date=None):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO examens (nom, date) VALUES (?, ?)", (nom, date))
    conn.commit()
    conn.close()

def get_examens():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, nom, date FROM examens")
    rows = c.fetchall()
    conn.close()
    return rows

def delete_examen(examen_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM examens WHERE id=?", (examen_id,))
    conn.commit()
    conn.close()

# CRUD Questions
def add_question(examen_id, texte, niveau_bloom):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO questions (examen_id, texte, niveau_bloom) VALUES (?, ?, ?)", (examen_id, texte, niveau_bloom))
    conn.commit()
    conn.close()

def get_questions():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, examen_id, texte, niveau_bloom FROM questions")
    rows = c.fetchall()
    conn.close()
    return rows

def delete_question(question_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM questions WHERE id=?", (question_id,))
    conn.commit()
    conn.close()

# CRUD Compétences
def add_competence(texte):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO competences (texte) VALUES (?)", (texte,))
    conn.commit()
    conn.close()

def get_competences():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, texte FROM competences")
    rows = c.fetchall()
    conn.close()
    return rows

def delete_competence(competence_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM competences WHERE id=?", (competence_id,))
    conn.commit()
    conn.close()

# Association question <-> compétence
def add_question_competence(question_id, competence_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO question_competence (question_id, competence_id) VALUES (?, ?)", (question_id, competence_id))
    conn.commit()
    conn.close()

def delete_question_competence(question_id, competence_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM question_competence WHERE question_id=? AND competence_id=?", (question_id, competence_id))
    conn.commit()
    conn.close()