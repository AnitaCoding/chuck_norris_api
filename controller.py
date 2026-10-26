from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from model import Model_Api


app = FastAPI()
m = Model_Api()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Permite cualquier origen (dominio)
    allow_credentials=False,  # ¡ATENCIÓN! Debe ser False si usas "" en origins, si usa usuario y contraseña, tendrá que ser true
    allow_methods=["*"],      # Permite todos los métodos HTTP (GET, POST, PUT, etc.)
    allow_headers=["*"],      # Permite todas las cabeceras HTTP
)

@app.get("/jokes/random", tags=['Jokes'])
def index():
    return m.get_random_joke()
    
@app.get("/jokes_categories/", tags=["Categories"])
def get_categories():
    return m.get_categories()

@app.get("/jokes/by_category/{category}", tags=['Jokes'])
def get_joke_by_category(category: str):
    return m.get_jokes(category)