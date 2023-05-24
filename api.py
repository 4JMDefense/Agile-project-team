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

'''safely closing DB so that none are remaining after API call requests are done
Databases are stored and used in the duration of the application living around
a global space 'g' '''

''' prevents memory leaks and etc from potential db instances not exited'''

@app.teardown_appcontext
def close_db(exception): 
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# default route
@app.route('/')
def display_notes():
    db = get_db()
    c = db.cursor()
    c.execute("SELECT title, body FROM notes")
    notes = c.fetchall()
    c.close()
    return render_template('index.html', notes=notes)

# endpoint for saving notes into the DB from the webpage
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

# endpoint contributes to loading and querying notes when searching
@app.route('/notes', methods=['GET'])
def get_notes():
    db = get_db()
    c = db.cursor()
    query = request.args.get('query', '') # request for query or blank by default
    c.execute("SELECT title, body, updated FROM notes WHERE title LIKE ?",('%' + query + '%',))
    # % matches any sequence of characters used in the query for the search bar
    notes = [{"title": title, "body": body, "updated": updated} for title, body, updated in c.fetchall()]
    c.close()
    return jsonify(notes)

if __name__ == '__main__':
    app.run(debug=True, threaded=True)