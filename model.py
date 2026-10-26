import requests as consult

class Model_Api:
    def __init__(self):
        self.categories = None
        self.jokes = None
        self.categories_list = []

    def get_categories(self):
        self.categories = consult.get('https://api.chucknorris.io/jokes/categories')
        self.categories_list = self.categories.json()
        return self.categories_list

    def get_jokes(self, selected_category):
        self.jokes = consult.get(f'https://api.chucknorris.io/jokes/random?category={selected_category}')
        return self.jokes.json()['value']
    
    def get_random_joke(self):
        self.jokes = consult.get('https://api.chucknorris.io/jokes/random')
        return self.jokes.json()['value']

