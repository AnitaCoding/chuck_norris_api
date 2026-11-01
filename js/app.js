const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories'
const CHOSEN_CATEGORY_URL = 'https://api.chucknorris.io/jokes/random?category='
const RANDOM_JOKE = 'https://api.chucknorris.io/jokes/random'
const POST_URL = 'https://localhost:8000/jokes'

const SELECTION = document.getElementById('choose-category')
const JOKE = document.getElementById('joke')
const SAVE_BUTTON = document.getElementById('save_button')
const FAVOURITE_TAB = document.getElementById('favourite-tab')
const FAVOURITE_CONTAINER = document.getElementById('fav-container')
const HISTORY_TAB = document.getElementById('history-tab')
const HISTORY_CONTAINER = document.getElementById('history-container')
const COPY_BUTTON = document.getElementById('copy-button')
const SHARE_BUTTON = document.getElementById('share-button');

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

function setUrl(tableName){
    let currentUrl = ''
    if (tableName == 'fav'){
        currentUrl = 'http://localhost:8000/jokes/favourites'
    }else{
        currentUrl = 'http://localhost:8000/jokes/history'
    }
    return currentUrl
}
function getFactsFromDB(tableName){
    const URL = setUrl(tableName)
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        if(data.length == 0){
            console.log('nada guardado')
            //Aquí hay que poner un alert o una notificación
        }else{
            showFactsFromDB(data, tableName)
        }
        
    }).catch(error=> {
        console.log("Error al cargar los datos: ", error)
    })
}

function showFactsFromDB(data, tableName){
    let facts_list = ''
    data.forEach(element => {            
            facts_list += `<p>${element.joke}</p>`
        });
    
    if (tableName == 'fav'){
        FAVOURITE_CONTAINER.innerHTML = facts_list
    }else{
        HISTORY_CONTAINER.innerHTML = facts_list
    }
    
}
FAVOURITE_TAB.addEventListener('click',() => getFactsFromDB('fav'))
HISTORY_TAB.addEventListener('click',() => getFactsFromDB('history'))

//Copiar al portapapeles
async function writeClipboardText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}

COPY_BUTTON.addEventListener("click", () => writeClipboardText(JOKE.textContent));


//Compartir chiste

async function shareJoke() {
  const shareData = {
    text: JOKE.textContent
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error("No se pudo compartir el chiste:", err);
  }
}

SHARE_BUTTON.addEventListener('click', shareJoke)
/*function is_favourite(){
manda consulta a bd
si es favorito retorna true y pinta el icono de la señal completa y disabled el botón.
si no es, pinta la señal vacía
}*/