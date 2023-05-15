from flask import Flask, render_template, request, jsonify, g
import datetime
import os
import sqlite3
import create_db

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
    c = getattr(g, '_cursor', None)
    if c is not None:
        c.close()

@app.route('/')
def notify():
    return render_template('index.html')

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

if __name__ == '__main__':
    app.run(debug=True, threaded=True)