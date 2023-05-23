import unittest
from flask_testing import TestCase
from api import app

class RoutesTest(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        return app

    def test_index_route(self): # testing for the main working route itself
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def invalid_route(self): # tests for incorrect routes, should send a 404 response
        response = self.client.get('/wrong_route')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()