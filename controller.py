from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from lara_sdk import Translator, Credentials

from model_api import Model_Api
from model_db import *
from lara_translation import *

app = FastAPI()
m = Model_Api()
credentials = Credentials(access_key_id=LARA_ACCESS_KEY_ID, access_key_secret=LARA_ACCESS_KEY_SECRET)
lara = Translator(credentials)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Permite cualquier origen (dominio)
    allow_credentials=False,  # ¡ATENCIÓN! Debe ser False si usas "" en origins, si usa usuario y contraseña, tendrá que ser true
    allow_methods=["*"],      # Permite todos los métodos HTTP (GET, POST, PUT, etc.)
    allow_headers=["*"],      # Permite todas las cabeceras HTTP
)

class JokeModel(BaseModel):
    id_joke: str
    joke: str
    table_name: str

TABLE_NAMES = {
    "favourites": "fav_facts",
    "historial": "history"
}

#Controles API
@app.get("/jokes/random", tags=['Jokes'])
def index():
    joke_data = m.get_random_joke()
    joke_translated = lara.translate(joke_data['value'], source="en-US", target="es-ES").translation
    save_history(joke_data['id'], joke_translated)
    return {
        "id_joke": joke_data["id"],
        "joke": joke_translated
    }
    
@app.get("/jokes_categories/", tags=["Categories"])
def get_categories():
    result = []
    categories = m.get_categories()
    for item in categories:
        result.append(lara.translate(item, source="en-US", target="es-ES").translation)
    return result

@app.get("/jokes/by_category/{category}", tags=['Jokes'])
def get_joke_by_category(category: str):
    joke_data = m.get_jokes(category)
    joke_translated = lara.translate(joke_data['value'], source="en-US", target="es-ES").translation
    save_history(joke_data['id'], joke_translated)
    return {
        "id_joke": joke_data["id"],
        "joke": joke_translated
    }

def save_history(id: str, joke: str):
    add_to_history(id, joke)

#Controles BD

#Gets de favourites
@app.get("/jokes/favourites", tags=['Jokes'])
def get_favourites():
    return select_all('fav_facts')

@app.get("/jokes/favourites/{id}", tags=['Jokes'])
def is_favourite(id:str):
    return select_by_id(id, 'fav_facts')

#Gets de history
@app.get("/jokes/history", tags=['Jokes'])
def get_history():
    return select_all('history')

def check_table_name(table_name):
    if(table_name not in TABLE_NAMES):
        raise HTTPException(
        status_code=422,
        detail = 'Nombre de tabla incorrecto')
    else:
        current_table = TABLE_NAMES[table_name]
    return current_table

#Post
@app.post("/jokes", tags=["Jokes"])
def post_joke(body: JokeModel):
    #Se comprueba que el nombre de tabla que llega de js es correcto (viene en el json)
    #Si no, se lanza una excepción
    #No se trae el nombre exacto de la tabla desde js para evitar que un cliente envíe un valor inesperado.
    current_table = check_table_name(body.table_name)
    insert_data([body.id_joke, body.joke], current_table)

#Delete
@app.delete("/jokes/{table}/{id}", tags=["Jokes"])
def delete_joke_by_id(table:str, id:str):
    current_table = check_table_name(table)
    try:
        delete_by_id(current_table, id)
        return {'Chiste' : ' eliminado correctamente'}

    except Exception as ex:
        print(ex)
        return {'Ha fallado': ' el borrado'}
