const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories'
const CHOSEN_CATEGORY_URL = 'https://api.chucknorris.io/jokes/random?category='
const RANDOM_JOKE = 'https://api.chucknorris.io/jokes/random'
const POST_URL = 'https://localhost:8000/jokes'
const FAVOURITES_URL = 'http://localhost:8000/jokes/favourites'

const RANDOM_JOKE_CONTAINER = document.getElementById('random-joke-container')
const SELECTION = document.getElementById('choose-category')
const CATEGORY_JOKE_CONTAINER = document.getElementById('category-joke-container')
const CATEGORY_BUTTON = document.getElementById('button-category')
const FAVOURITE_TAB = document.getElementById('favourite-tab')
const FAVOURITE_CONTAINER = document.getElementById('fav-container')
const HISTORY_TAB = document.getElementById('history-tab')
const HISTORY_CONTAINER = document.getElementById('history-container')

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
        CATEGORY_JOKE_CONTAINER.innerHTML = `<p class="joke-text" data-joke-id=${data.id}>${data.value}</p>
                        <div class="joke-buttons">
                            <button type="button" class="btn save-button">Guardar<span><i class="fa-regular fa-bookmark"></i></span></button>
                            <button type="button" class="btn copy-button">Copiar<span><i class="fa-regular fa-clipboard"></i></span></button>
                            <button type="button" class="btn share-button">Compartir<span><i class="fa-solid fa-share-nodes"></i></span></button>
                        </div>` 
        CATEGORY_BUTTON.style.display = 'inline-block'
        isFavourite(data.id, RANDOM_JOKE_CONTAINER)
    })
    .catch(error=> console.log("Error al cargar los datos: ", error))
}

CATEGORY_BUTTON.addEventListener('click', getChosenCategory)

function getRandomJoke(){
    fetch(RANDOM_JOKE)
    .then(response => response.json())
    .then(data =>{
        RANDOM_JOKE_CONTAINER.innerHTML = `<p class="joke-text" data-joke-id=${data.id}>${data.value}</p>
                        <div class="joke-buttons">
                        <button type="button" class="btn save-button">Guardar<span><i class="fa-regular fa-bookmark"></i></span></button>
                        <button type="button" class="btn copy-button">Copiar<span><i class="fa-regular fa-clipboard"></i></span></button>
                        <button type="button" class="btn share-button">Compartir<span><i class="fa-solid fa-share-nodes"></i></span></button>
                        </div>`
        connectButtonActions(RANDOM_JOKE_CONTAINER, data)
        isFavourite(data.id, RANDOM_JOKE_CONTAINER)
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

function setUrl(tableName){
    let currentUrl = ''
    if (tableName == 'fav'){
        currentUrl = FAVOURITES_URL
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
            facts_list += `<div class="joke-card">
                                <p class="joke-text" data-joke-id=${element.joke_id}>${element.joke}</p>
                                <div class="joke-buttons">
                                    <button type="button" class="btn save-button">Guardar<span><i class="fa-regular fa-bookmark"></i></span></button>
                                    <button type="button" class="btn copy-button">Copiar<span><i class="fa-regular fa-clipboard"></i></span></button>
                                    <button type="button" class="btn share-button">Compartir<span><i class="fa-solid fa-share-nodes"></i></span></button>
                                </div>
                            </div>`
        });
    
    if (tableName == 'fav'){
        FAVOURITE_CONTAINER.innerHTML = facts_list
        connectAllButtonActions(FAVOURITE_CONTAINER)
    }else{
        HISTORY_CONTAINER.innerHTML = facts_list
        connectAllButtonActions(HISTORY_CONTAINER)
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

//Compartir chiste

async function shareJoke(text) {
    const shareData = {
        text: text
    };

    try {
        await navigator.share(shareData);
    } catch (err) {
        console.error("No se pudo compartir el chiste:", err);
    }
}

function isFavourite(id, container){
    fetch(`${FAVOURITES_URL}/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(isFavouriteResponse => {
        const icon = container.querySelector(".save-button i");
        const saveButton = container.querySelector(".save-button");

        if (isFavouriteResponse) {
            icon.classList.replace("fa-regular", "fa-solid");
            saveButton.disabled = true; 
        }
    })
    .catch(error => {
        console.error("No se pudo comprobar si es favorito:", error);
    });
}

//Asigna acciones a cada botón después del chiste
function connectButtonActions(container, joke) {
    const text = container.querySelector(".joke-text");
    const copy_button = container.querySelector(".copy-button");
    const share_button = container.querySelector(".share-button");
    const save_button = container.querySelector(".save-button");

    copy_button.addEventListener("click", async () => {
        await writeClipboardText(text.textContent);
    });

    share_button.addEventListener("click", async () => {
        await shareJoke(text.textContent);
    });

    save_button.addEventListener("click", () => {
        saveJoke("favourites", joke.joke_id, text.textContent);
    });
}

//Una función que recorre cada card y crea un objeto Joke por cada una de ellas.
//Llama a connect buttons para crear las acciones de los botones de cada card 
function connectAllButtonActions(container) {
  const cards = container.querySelectorAll(".joke-card");

  cards.forEach(card => {
    const text = card.querySelector(".joke-text")
    const joke = {
        joke_id: text.dataset.jokeId,
        joke: text.textContent
    };
    connectButtonActions(card, joke);
    if (container === HISTORY_CONTAINER) {
        isFavourite(joke.joke_id, card);
    }
  });
}