const searchInput = document.querySelector(".recherche-poke input")
const allPokemon = [];
let tableauTrier = [];
const listPoke = document.querySelector(".liste-poke")
let index = 21; // point de départ pour déclencher l'affichage de pokemon supplémentaires
let chargement = document.querySelector(".loader");
const types = {
    grass: '#78c850',
    ground: '#E2BF65',
    dragon: '#6F35FC',
    fire: '#F58271',
    electric: '#F7D02C',
    fairy: '#D685AD',
    poison: '#966DA3',
    bug: '#B3F594',
    water: '#6390F0',
    normal: '#D9D5D8',
    psychic: '#F95587',
    flying: '#A98FF3',
    fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};

function createCard(tableauTrier) {

    for (let i = 0; i < tableauTrier.length; i++) {
        const carte = document.createElement("li");

        carte.style.backgroundColor = types[tableauTrier[i].type];

        const txtCarte = document.createElement("h5");
        txtCarte.innerText = tableauTrier[i].name;

        const idCarte = document.createElement("p");
        idCarte.innerText = `ID:${tableauTrier[i].id}`;

        const imgCarte = document.createElement("img");
        imgCarte.src = tableauTrier[i].pic;

        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);
        carte.appendChild(imgCarte);
        listPoke.appendChild(carte);
    }
}

// Recherche
searchInput.addEventListener("keyup", recherche);

function recherche() {
if (index < 151) {
    addPokeToScroll(130) // j'affiche toutes les cartes pokemon
}
    let filter, allLi, allTitles;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll("li");
    allTitles = document.querySelectorAll("li > h5");
    
    for (let i =0; i < allLi.length; i++) {
        let title = allTitles[i].innerText;
        
        if (title.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex" ;
        } else {
            allLi[i].style.display = "none";
        }
    }
}

// Scroll infini
function addPokeToScroll(number) {

    if (index > 151) {
        return
    }
    let newPok = allPokemon.slice(index, index + number);
    createCard(newPok);
    index += number
}
window.addEventListener("scroll", () => {
    const  {scrollTop, scrollHeight, clientHeight } = document.documentElement ;// const{} est du restructuring à savoir extraction de  données d'un tableau ou d'un objet (ici les valeurs de scroll du documentElement, le HTML
    if (clientHeight + scrollTop >= scrollHeight - 20) {
        addPokeToScroll(6);
    }
})
// scrollTop est le scroll effectué depuis le top
// scrollHeight est le la hauteur total scrollable (du site)
// clientHeight est la hauteur visible de la fenêtre

async function fetchPokemonBase() { // resolves with response headers
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    let allPoke = await response.json(); // read body as json

    async function fetchPokemonComplet(pokemon) {
        let pokemonObjFull = {};    //chaque entrée du tableau transformé en un objet pokemon contenant son nom, son id, son image de face, sa catégorie
        let url = pokemon.url;  //url de ses données
        let name = pokemon.name; //son nom

        // je récupère toutes les caractéristiques du pokemon
        let response = await fetch(url)
        let pokeData = await response.json();
        pokemonObjFull.pic = pokeData.sprites.front_default;    // url de son img 
        pokemonObjFull.type = pokeData.types[0].type.name;  // son type
        pokemonObjFull.id = pokeData.id;  // son id

        // je récupère son espèce
        let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        let specificPokeData = await speciesResponse.json();
        pokemonObjFull.name = specificPokeData.names[4].name; // son nom en français

        allPokemon.push(pokemonObjFull)

        if (allPokemon.length === 151) {
            tableauTrier = allPokemon.sort((a, b) => {  //je trie par id croissant
                return a.id - b.id;
            }).slice(0, 21)

            createCard(tableauTrier);
            chargement.style.display = "none"
        }
    }

    allPoke.results.forEach((pokemon) => {  //result = clef result dans le json allPoke
        fetchPokemonComplet(pokemon);
    })
}

 fetchPokemonBase();

// label input animation
searchInput.addEventListener("input", (e) => {
    if (e.target.value !== "") {
        e.target.parentNode.classList.add("active-input")
    } else if (e.target.value === "") {
        e.target.parentNode.classList.remove("active-input")
    }
})