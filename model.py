import requests as consult

class Model_Api:
    def __init__(self):
        self.categories = None
        self.jokes = None
        self.categories_list = []
        self.categories_list_dict = []

    def get_categories(self):
        self.categories = consult.get('https://api.chucknorris.io/jokes/categories')
        self.categories_list = self.categories.json()


    def get_jokes(self, selected_category):
        self.jokes = consult.get(f'https://api.chucknorris.io/jokes/random?category={selected_category}')

    def make_categories_dict(self):
        contador = 1
        for i in self.categories_list:
            self.categories_list_dict.append({'Clave':contador, 'Categoría': i}) #agregar un diccionario por cada vuelta
            contador+=1

    def get_random_joke(self):
        self.jokes = consult.get('https://api.chucknorris.io/jokes/random')

m = Model_Api()
m.get_random_joke()
print(m.jokes.json()['value'])
