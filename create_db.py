import sqlite3
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
conn = sqlite3.connect(os.path.join(current_dir, 'notes.db'))
c = conn.cursor()
c.execute('''CREATE TABLE notes
                (id INTEGER PRIMARY KEY, title TEXT, body TEXT, updated TEXT)''')
conn.commit()
conn.close()