import unittest
import sqlite3
import os
import create_db

class test_database(unittest.TestCase):
    # recognize an existing database
    def setUp(self):
        self.db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'notes.db')

    def remove(self):
        if os.path.exists(self.db_path):
            os.remove(self.db_path) # remove test db after test
            
    def test_db(self):
        if not os.path.exists(self.db_path):
            create_db.database()

        # Verification that the database was created
        self.assertTrue(os.path.exists(self.db_path))

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor() 
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'")
        result = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(result)

if __name__ == '__main__':
    unittest.main()
