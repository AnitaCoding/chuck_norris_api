const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories'
const CHOSEN_CATEGORY_URL = 'https://api.chucknorris.io/jokes/random?category='
const RANDOM_JOKE = 'https://api.chucknorris.io/jokes/random'
const POST_URL = 'https://localhost:8000/jokes'

const SELECTION = document.getElementById('choose-category')
const JOKE = document.getElementById('joke')
const SAVE_BUTTON = document.getElementById('save_button')
const FAVOURITE_TAB = document.getElementById('favourite-tab')
const FAVOURITE_CONTAINER = document.getElementById('fav-container')

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
        randomJoke.textContent = data.value 
        console.log(data.value)
    })
    .catch(error=> console.log("Error al cargar los datos: ", error))
}

let btn = document.getElementById('button-random')
btn.addEventListener('click', getRandomJoke)

SELECTION.addEventListener('change', getChosenCategory)

function saveJoke(tableName){
    //Capturar datos
    //const joke_id = SELECTED_MOVIE_ID hay que pensar en cómo guardar el id
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

function getFactsFromDB(tableName){
    //const URL = setUrl(tableName)
    fetch('http://localhost:8000/jokes/favourites')
    .then(response => response.json())
    .then(data => {
        if(data.length == 0){
            console.log('nada guardado')
            //Aquí hay que poner un alert o una notificación
        }else{
            showFactsFromDB(data)
            console.log(data)
        }
        
    }).catch(error=> {
        console.log("Error al cargar los datos: ", error)
    })
}

function showFactsFromDB(data){
    let facts_list = ''
    data.forEach(element => {            
            facts_list += `<p>${element.joke}</p>`
        });

    //aquí habrá que manejar qué contenedor se elige en función de si es favoritos o histórico
    FAVOURITE_CONTAINER.innerHTML = facts_list
}
FAVOURITE_TAB.addEventListener('click', getFactsFromDB)