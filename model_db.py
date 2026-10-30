from conexion import Conexion
import sqlite3

def formato(response):
    result = []
    for elt in response.fetchall():
        result.append(dict(elt))
    return(result)

#Seleccionamos todos para poder verlos en el front
def select_all(table):
    #Usamos consulta parametrizada al buscar un string y no un integer
    conexion_select_by = Conexion(f'SELECT * FROM {table}')
    response = conexion_select_by.res
    result = formato(response)
    conexion_select_by.con.close()
    return result

#Seleccionamos por Id para ver si el chiste que estamos viendo ya está en favoritos
def select_by_id(id: str):
    #Usamos consulta parametrizada al buscar un string y no un integer
    conexion_select_by = Conexion(f'SELECT * FROM fav_facts WHERE joke_id = ?', (id,))
    response = conexion_select_by.res
    result = formato(response)
    conexion_select_by.con.close()
    return len(result) > 0

def insert_data(data: list, table: str):
    try:
        conexion_insert = Conexion(f'INSERT INTO {table}(joke_id, joke) VALUES (?,?);', data)          
        conexion_insert.res
        conexion_insert.con.commit()#para confirmar guardado
    except sqlite3.Error as error:
        print(error)
    conexion_insert.con.close()