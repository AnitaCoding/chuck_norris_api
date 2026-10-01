from model import Model_Api
from view import ViewApi


class Controller_Api:

    def __init__(self):
        
        self.model_api = Model_Api()

        self.model_api.get_categories()
        self.model_api.make_categories_dict()

        self.view = ViewApi()

        self.view.show_categories(self.model_api)

        self.view.select_category()

    def selection_logic(self):

        for diccionario in self.model_api.categories_list_dict:
            if diccionario['Clave'] == int(self.view.selection):
                self.view.selection = diccionario['Categoría']

        self.model_api.get_jokes(self.view.selection)

        print('Respuesta en JSON', self.model_api.jokes.json())

        #Ejemplo para acceder a un valor del JSON
        self.view.show_jokes(self.model_api)