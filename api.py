from flask import Flask, render_template, request, jsonify, g
import datetime
import os
import sqlite3
import create_db
from flask_cors import CORS

app = Flask(__name__)

current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, 'notes.db')

if not os.path.exists(db_path):
    create_db.database()

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(db_path, check_same_thread=False)
    return db

@app.teardown_appcontext
def close_db(exception): 
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def display_notes():
    db = get_db()
    c = db.cursor()
    c.execute("SELECT title, body FROM notes")
    notes = c.fetchall()
    c.close()
    return render_template('index.html', notes=notes)

@app.route('/save', methods=['POST'])
def save_note():
    data = request.get_json()
    title = data['title']
    body = data['body']
    update_log = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db = get_db()
    c = db.cursor()
    c.execute('INSERT INTO notes (title, body, updated) VALUES (?, ?, ?)', (title, body, update_log))
    db.commit()

    print(f"Note saved: {title}")
    return jsonify({'status': 'success 200'})

CORS(app)

@app.route('/notes', methods=['GET'])
def get_notes():
    db = get_db()
    c = db.cursor()
    c.execute("SELECT title, body, updated FROM notes")
    notes = [{"title": title, "body": body, "updated": updated} for title, body, updated in c.fetchall()]
    c.close()
    return jsonify(notes)

if __name__ == '__main__':
    app.run(debug=True, threaded=True)