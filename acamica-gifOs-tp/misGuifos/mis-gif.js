
var gridGifSubidos = document.getElementById("gifSubidos");

// Cuando carga la pagina

window.onload = function() {

    if (localStorage.getItem('GifList')) {

        cargarLocalStorageGif(gridGifSubidos);

    } else {
        //no hay gif
        console.log("No existen gifs guardados");
    }

}

// Eventos botones

function reload() {
    location.assign('../homePage/gifOS.html')
}

function crearGuifos() {
    location.assign('../uploadPage/upload.html')
}


// Funcion para limpiar localStorage
// window.localStorage.clear();




