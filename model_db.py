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
def select_by_id(id: str, table:str):
    #Usamos consulta parametrizada al buscar un string y no un integer
    conexion_select_by = Conexion(f'SELECT * FROM {table} WHERE joke_id = ?', (id,))
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

def more_than_10():
    conexion_check_10 = Conexion(f'SELECT COUNT(*) AS total FROM history')
    response = conexion_check_10.res
    result = formato(response)
    conexion_check_10.con.close()
    return result[0]['total'] >= 10

def delete_data():
    try:
        conexion_delete = Conexion(f'DELETE FROM history WHERE id = (SELECT MIN(id) FROM history)')
        conexion_delete.res
        conexion_delete.con.commit()
        conexion_delete.con.close()
    except sqlite3.Error as error:
        print('Error delete: ', error)

def add_to_history(id: str, joke: str):
    total_jokes = more_than_10()
    if total_jokes and not select_by_id(id, 'history'):
        delete_data()
    insert_data([id, joke], 'history')