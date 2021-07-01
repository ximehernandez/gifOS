
// Endpoints Giphy
const apiKey = 'RGauNfO7yoX8gcn0ABazOy02HjEupKvc'; // mi API key
const searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
const subidaEndPoint = 'https://upload.giphy.com/v1/gifs?';
const buscarPorId = 'https://api.giphy.com/v1/gifs/';
const randomEndPoint = 'https://api.giphy.com/v1/gifs/random?';
const tendenciasEndPoint = 'https://api.giphy.com/v1/gifs/trending?';
const segBusqUrl = 'https://suggestqueries.google.com/complete/search?output=firefox&callback=mostrarJsonp';
const userName = 'ximehernandezde89';

// Prediccion palabras sugeridas
var arraySugBus = [];
var maxsug = 3;

// Gifs random para galeria de sugerencias
var sugerenciasRandom = [];
var maxSugerencias = 4;

// Gifs para galeria de tendencias
var maxTendencias = 10

// Mostrar o esconder elementos
var mostrar = true;
var esconder = false;

var limitebusqueda = 10;
var resultado;

/******************************************* Botones **************************************************/

// Reload logo

function reload() {
    location.reload('../homePage/gifOS.html')
}

// Crear Guifos

function crearGuifos() {
    location.assign('../uploadPage/upload.html')
}


// Abrir y cerrar drop
function openDropDown() {
    document.getElementById('submenu').classList.toggle('mostrar');
}

function closeDropDown() {
    document.getElementById('submenu').classList.remove('mostrar');
}

// Elegir Tema
function cambiarTema(eleccionTema) {

    window.localStorage.setItem('tema', eleccionTema);

    let bodyTheme = document.getElementsByTagName('body');
    let i;

    for (i = 0; i < bodyTheme.length; i++) {
        bodyTheme[i].setAttribute('color-theme', eleccionTema);
    }

    if (eleccionTema == 'Sailor-Day') {
        document.getElementById('logo').setAttribute('src', '../assets/gifOF_logo.png');
    }

    if (eleccionTema == 'Sailor-Night') {
        document.getElementById('logo').setAttribute('src', '../assets/gifOF_logo_dark.png');
    }
}

// Funcion para guardar tema elegido

function recargarTema() {
    let theme = localStorage.getItem('tema')

    if (theme != null) {
        cambiarTema(theme);
    }
}

recargarTema();

// Mis Guifos

function misGuifos() {
    location.assign('../misGuifos/mis-gif.html');

}

// Funciones globales

function cargarLocalStorageGif(galeria) {
    //busco los id en el array
    let misGifArr = JSON.parse(localStorage.getItem('GifList'));
    for (let gifUrl of misGifArr) {
        //creo los elementos html       
        let tarjeta = document.createElement('div');
        tarjeta.setAttribute('class', 'gifCard');
        tarjeta.innerHTML +=
            '<img src =' + gifUrl + '>'
        galeria.appendChild(tarjeta);
    }
}

// Funcion para esconder o mostrar elementos
function mostEsconComponet(componente, mostrar) {
    mostrar ? componente.setAttribute('style', 'display:block;') : componente.setAttribute('style', "display:none;");
    return;
}


