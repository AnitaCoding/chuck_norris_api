const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories'
const CHOSEN_CATEGORY_URL = 'https://api.chucknorris.io/jokes/random?category='
const RANDOM_JOKE = 'https://api.chucknorris.io/jokes/random'
const POST_URL = 'https://localhost:8000/jokes'

const SELECTION = document.getElementById('choose-category')
const JOKE = document.getElementById('joke')
const SAVE_BUTTON = document.getElementById('save_button')

function getCategories(){
    //Petición http GET usando FetchAPI
    fetch(CATEGORIES_URL)
    .then(response => response.json())
    .then(data =>{
        let options = '';
        data.forEach(element => {
            options += `<option value="${element}">${element}</option>`      
        });
        //Insertar la categoría cargada dentro del selection
        SELECTION.innerHTML = options;
    }).catch(error=> console.log("Error al cargar los datos: ", error))
}

getCategories()

function getChosenCategory(){
    //Petición http GET usando FetchAPI
    fetch(`${CHOSEN_CATEGORY_URL}${SELECTION.value}`)
    .then(response => response.json())
    .then(data =>{
        let categoryJoke = document.getElementById('joke')
        categoryJoke.innerHTML = data.value 
        console.log(data.value)
    })
    .catch(error=> console.log("Error al cargar los datos: ", error))
}

function getRandomJoke(){
    fetch(RANDOM_JOKE)
    .then(response => response.json())
    .then(data =>{
        let randomJoke = document.getElementById('joke')
        randomJoke.parentNode.style.display = 'block'
        randomJoke.innerHTML = data.value 
        console.log(data.value)
    })
    .catch(error=> console.log("Error al cargar los datos: ", error))
}

let btn = document.getElementById('button-random')
btn.addEventListener('click', getRandomJoke)

SELECTION.addEventListener('change', getChosenCategory)

function saveJoke(tableName){
    //Capturar datos
    const joke_id = SELECTED_MOVIE_ID
    const JOKE = document.getElementById('nombre').value

    fetch(`${POST_URL}`,
    {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(
            {
                //La key tiene que ser el nombre que le damos en fastapi
                //El value el que le damos en js
                id_joke: joke_id,
                joke: JOKE,
                table_name: tableName
            }
        )
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }
        alert('Guardado')            
    })
    .catch(
        error=>{           
            alert('No se ha podido guardar.')
            console.log('Detalle error: ', error)
        }
    );    
}

SAVE_BUTTON.addEventListener('click', () => saveJoke('favourites'))