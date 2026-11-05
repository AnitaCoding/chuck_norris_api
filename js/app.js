const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories'
const CHOSEN_CATEGORY_URL = 'https://api.chucknorris.io/jokes/random?category='
const RANDOM_JOKE = 'https://api.chucknorris.io/jokes/random'
const POST_DELETE_URL = 'http://localhost:8000/jokes'
const FAVOURITES_URL = 'http://localhost:8000/jokes/favourites'
const HISTORY_URL = 'http://localhost:8000/jokes/history'

const RANDOM_JOKE_CONTAINER = document.getElementById('random-joke-container')
const RANDOM_BUTTON = document.getElementById('button-random')
const SELECTION = document.getElementById('choose-category')
const CATEGORY_JOKE_CONTAINER = document.getElementById('category-joke-container')
const CATEGORY_BUTTON = document.getElementById('button-category')
const FAVOURITE_TAB = document.getElementById('favourite-tab')
const FAVOURITE_CONTAINER = document.getElementById('fav-container')
const HISTORY_TAB = document.getElementById('history-tab')
const HISTORY_CONTAINER = document.getElementById('history-container')
const DELETE_HISTORY_BUTTON = document.getElementById('delete-history')


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
    }).catch(error=> {
        showToast('Error: No se han podido cargar las categorías', 'text-bg-danger')
        console.log("Error al cargar los datos: ", error)
    })
}

getCategories()

function getChosenCategory(){
    //Petición http GET usando FetchAPI
    fetch(`${CHOSEN_CATEGORY_URL}${SELECTION.value}`)
    .then(response => response.json())
    .then(data =>{
        const ACTION_BUTTONS_HTML = createActionButtons('category')
        CATEGORY_JOKE_CONTAINER.innerHTML = `<p class="joke-text" data-joke-id=${data.id}>${data.value}</p>${ACTION_BUTTONS_HTML}`
        CATEGORY_BUTTON.style.display = 'inline-block'
        const JOKE = {
            joke_id: data.id,
            joke:data.value
        }
        connectButtonActions(CATEGORY_JOKE_CONTAINER, CATEGORY_JOKE_CONTAINER, JOKE)
        isFavourite(data.id, CATEGORY_JOKE_CONTAINER)
        saveJoke('historial', JOKE, CATEGORY_JOKE_CONTAINER)
    })
    .catch(error=> {
        showToast('Error al cargar los datos', 'text-bg-danger')
        console.log("Error al cargar los datos: ", error)})
}
SELECTION.addEventListener('change', getChosenCategory)
CATEGORY_BUTTON.addEventListener('click', getChosenCategory)

function getRandomJoke(){
    fetch(RANDOM_JOKE)
    .then(response => response.json())
    .then(data =>{
        const ACTION_BUTTONS_HTML = createActionButtons('random')
        RANDOM_JOKE_CONTAINER.innerHTML = `<p class="joke-text" data-joke-id=${data.id}>${data.value}</p>${ACTION_BUTTONS_HTML}`
        const JOKE = {
            joke_id: data.id,
            joke:data.value
        }
        connectButtonActions(RANDOM_JOKE_CONTAINER, RANDOM_JOKE_CONTAINER, JOKE)
        isFavourite(data.id, RANDOM_JOKE_CONTAINER)
        saveJoke('historial', JOKE, RANDOM_JOKE_CONTAINER)
    })
    .catch(error=> {
        showToast('Error al cargar los datos', 'text-bg-danger')
        console.log("Error al cargar los datos: ", error)})
}

RANDOM_BUTTON.addEventListener('click', getRandomJoke)

function getFactsFromDB(tableName){
    const URL = setUrl(tableName)
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        if(data.length == 0){
            if(tableName == 'fav'){
                FAVOURITE_CONTAINER.innerHTML = '<p class="empty-tab-p">Todavía no hay ningún favorito.</p>'
            }else{
                HISTORY_CONTAINER.innerHTML = '<p class="empty-tab-p">Todavía no hay nada en el historial.</p>'
            }
        }else{
            showFactsFromDB(data, tableName)
        }
    }).catch(error=> {
        showToast('Error al cargar los datos', 'text-bg-danger')
        console.log("Error al cargar los datos: ", error)
    })
}

FAVOURITE_TAB.addEventListener('click',() => getFactsFromDB('fav'))
HISTORY_TAB.addEventListener('click',() => getFactsFromDB('history'))


function showFactsFromDB(data, tableName){
    let factsList = ''
    data.forEach(element => {            
            factsList += `<div class="joke-card">
                                <p class="joke-text" data-joke-id=${element.joke_id}>${element.joke}</p>`
            factsList += createActionButtons(tableName)
            factsList += '</div>'
        });
   
    if (tableName == 'fav'){
        FAVOURITE_CONTAINER.innerHTML = factsList
        connectAllButtonActions(FAVOURITE_CONTAINER)
    }else{
        HISTORY_CONTAINER.innerHTML = factsList
        connectAllButtonActions(HISTORY_CONTAINER)
    }   
}

function setUrl(tableName){
    let currentUrl = ''
    if (tableName == 'fav'){
        currentUrl = FAVOURITES_URL
    }else{
        currentUrl = HISTORY_URL
    }
    return currentUrl
}

function createActionButtons(section){
    let actionButtons = '<div class="joke-buttons">'
    if (section !== 'fav'){
        actionButtons += `<button type="button" class="btn save-button" aria-label="Guardar">
                            <span class="action-label">Guardar</span>
                            <span><i class="fa-regular fa-bookmark"></i></span>
                          </button>`
    }
    actionButtons += `<button type="button" class="btn copy-button" aria-label="Copiar">
                        <span class="action-label">Copiar</span>
                        <span><i class="fa-regular fa-clipboard"></i></span>
                    </button>
                    <button type="button" class="btn share-button" aria-label="Compartir">
                        <span class="action-label">Compartir</span>
                        <span><i class="fa-solid fa-share-nodes"></i></span>
                    </button>`
    if (section === 'fav' || section === 'history'){
        actionButtons += `<button type="button" class="btn delete-button" aria-label="Eliminar">
                            <span class = "action-label">Eliminar</span>
                            <span><i class="fa-solid fa-trash"></i></span>
                          </button>`                 
    }
    actionButtons += '</div>'
    return actionButtons
}

/*****ACCIONES DE LOS BOTONES******/

function saveJoke(tableName, joke, container){
    fetch(`${POST_DELETE_URL}`,
    {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(
            {
                //La key tiene que ser el nombre que le damos en fastapi
                //El value el que le damos en js
                id_joke: joke.joke_id,
                joke: joke.joke,
                table_name: tableName
            }
        )
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }
        if (tableName === 'favourites') {
            updateSaveButton(container)
            showToast('Guardado', 'text-bg-success' )
        }        
    })
    .catch(
        error=>{
            if (tableName === 'favourites') {
                updateSaveButton(container)
                showToast('No se ha podido guardar', 'text-bg-danger' )
            }
            console.log('Detalle error: ', error)
        }
    );    
}

//Copiar al portapapeles
async function writeClipboardText(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('!Copiado!', 'text-bg-success')
    } catch (error) {
        console.error(error.message);
        showToast('Se ha producido un error', 'text-bg-danger')
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
        showToast('Navegador incompatible con esta función, cambia a otro navegador', 'text-bg-danger')
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
        if (isFavouriteResponse) {updateSaveButton(container)}
    })
    .catch(error => {
        console.error("No se pudo comprobar si es favorito:", error);
    });
}

//Asigna acciones a cada botón después del chiste
function connectButtonActions(listContainer, container, joke) {
    const text = container.querySelector(".joke-text");
    const copyButton = container.querySelector(".copy-button");
    const shareButton = container.querySelector(".share-button");
    const saveButton = container.querySelector(".save-button");
    const deleteButton = container.querySelector(".delete-button")

    copyButton.addEventListener("click", async () => {
        await writeClipboardText(text.textContent);
    });

    shareButton.addEventListener("click", async () => {
        await shareJoke(text.textContent);
    });
    
    if (saveButton != null){
        saveButton.addEventListener("click", () => {
            saveJoke("favourites", joke, container);
        });
    }

    if(deleteButton != null){
        deleteButton.addEventListener("click", () => {
            if(listContainer == HISTORY_CONTAINER) {
                deleteJoke('historial', joke.joke_id)
            }else{
                deleteJoke('favourites', joke.joke_id)
            }
        })
        
    }
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
    connectButtonActions(container, card, joke);
    if (container === HISTORY_CONTAINER) {
        isFavourite(joke.joke_id, card);
    }
  });
}

function deleteJoke(tableName, id){

    fetch(`${POST_DELETE_URL}/${tableName}/${id}`, {
        method: 'DELETE'
    }).then(response=>{
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }
        showToast('Chiste eliminado correctamente','text-bg-success' )
        const listName = tableName === 'historial' ? 'history' : 'fav';
        getFactsFromDB(listName)

    }).catch(
        error=>{
            showToast('No se ha podido eliminar', 'text-bg-danger')
            console.log('Detalle error: ', error)
        }
    )
}

function updateSaveButton(container){
    const icon = container.querySelector(".save-button i");
    const saveButton = container.querySelector(".save-button");

    icon.classList.replace("fa-regular", "fa-solid");
    saveButton.disabled = true;
}

function deleteHistory(){
    fetch(`${POST_DELETE_URL}`, {
        method: 'DELETE'
    }).then(response=>{
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
        }
        showToast('Historial eliminado correctamente','text-bg-success')
        getFactsFromDB('history')

    }).catch(
        error=>{
            showToast('No se ha podido eliminar el historial', 'text-bg-danger')
            console.log('Detalle error: ', error)
        }
    )
}

DELETE_HISTORY_BUTTON.addEventListener('click', deleteHistory)

function showToast(message, color){
    const TOAST_DIV = document.querySelector('#toast-div')
    const TOAST_BODY = document.querySelector('.toast-body')
    if (!TOAST_DIV.classList.contains(color)){
        TOAST_DIV.classList.add(color)
    }
    TOAST_BODY.textContent = message

    bootstrap.Toast.getOrCreateInstance(
        document.getElementById('toast-div')
    ).show()

}