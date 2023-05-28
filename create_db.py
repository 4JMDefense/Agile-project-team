import sqlite3
import os

def database():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    conn = sqlite3.connect(os.path.join(current_dir, 'notes.db'))
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'")
    result = c.fetchone()

    if result is None:
        c.execute('''CREATE TABLE notes
                        (id INTEGER PRIMARY KEY, title TEXT, body TEXT, updated TEXT)''')
        conn.commit()
    conn.close()