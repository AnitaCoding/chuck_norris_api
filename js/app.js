const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories'
const RANDOM_JOKE = 'https://api.chucknorris.io/jokes/random'

function getCategories(){
    const selection = document.getElementById('choose-category')
    //Petición http GET usando FetchAPI
    fetch(CATEGORIES_URL)
    .then(response => response.json())
    .then(data =>{
        let options = '';
        data.forEach(element => {
            options += `<option  value="${element}">${element}</option>`      
        });
        //Insertar la categoría cargada dentro del selection
        selection.innerHTML = options;
    }).catch(error=> console.log("Error al cargar los datos: ", error))
}

getCategories()

function getRandomJoke(){
    fetch(RANDOM_JOKE)
    .then(response => response.json())
    .then(data =>{
        let pJoke = document.getElementById('p-joke')
        pJoke.innerHTML = data.value 
        console.log(data.value)
    })
    .catch(error=> console.log("Error al cargar los datos: ", error))
}

let btn = document.getElementById('button-random')
btn.addEventListener('click', getRandomJoke)