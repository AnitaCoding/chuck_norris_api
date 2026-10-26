from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from lara_sdk import Translator, Credentials

from model import Model_Api
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

@app.get("/jokes/random", tags=['Jokes'])
def index():
    res = lara.translate(m.get_random_joke(), source="en-US", target="es-ES")
    return res.translation
    
@app.get("/jokes_categories/", tags=["Categories"])
def get_categories():
    result = []
    categories = m.get_categories()
    for item in categories:
        result.append(lara.translate(item, source="en-US", target="es-ES").translation)
    return result

@app.get("/jokes/by_category/{category}", tags=['Jokes'])
def get_joke_by_category(category: str):
    res = lara.translate(m.get_jokes(category), source="en-US", target="es-ES")
    return res.translation