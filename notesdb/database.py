import sqlite3

con = sqlite3.connect('example.db')
cur = con.execute('''CREATE TABLE IF NOT EXISTS NOTES
(sku text, notes text, )''')

cur.execute('''INSERT OR IGNORE INTO notes VALUES
                ('SKUE1235, 'AGILE NOTES', 'TASLS')''')

con.commit