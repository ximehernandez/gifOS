// Cuando se carga la pagina

window.onload = function() {

    for (let index = 0; index < maxSugerencias; index++) {
        getSugerencias(sugerenciasRandom);
    }
    getTendencias();

    inputBusqueda.value = '';
};

// Palabras sugeridas
var inputBusqueda = document.getElementById('input');
var wrapSugerencias = document.getElementById('predictions');
var divSug = document.getElementById('predictions-hidden');

/******************************************* Galerias **************************************************/

// Fetch random
async function getSugerencias(array) {

    const found = await fetch(randomEndPoint + '&api_key=' + apiKey)
        .then((response) => {
            return response.json()
        })
        .then(data => {
            var datos = data.data
            array.push({ url: datos.images.downsized.url, titulo: datos.title })
            galeriaSugerencias(array)
            return datos
        })
        .catch((error) => {
            return error;
        })

    return found
}

function galeriaSugerencias(array) {
    //tomo el elemento padre
    let sugerencias = document.getElementById('sugerencias');
    while (sugerencias.firstChild) {
        sugerencias.removeChild(sugerencias.firstChild);
    }

    // Estilado de gifs
    for (let index = 0; index < array.length; index++) {

        let tarjeta = document.createElement('div');
        tarjeta.setAttribute('class', "suggestionCard");
        let title = array[index].titulo;
        tarjeta.innerHTML =
            '<section class = "suggestionHeader" >' +
            '<p> #' + array[index].titulo + '  </p>' +
            '<img class="eliminar-sug"  onclick="borrarSug(' + index + ')" src = "../assets/close.svg" alt = "" > ' +
            '</section> <img class = "suge-gif" src =' + array[index].url + ' alt = "" >' +
            '<button class = "suge-btn-vermas" onclick="buscar(\'' + title + '\')"> ver mas... </button>';

        sugerencias.appendChild(tarjeta);
    }
}

// Galeria de tendencias

async function getTendencias() {

    const found = await fetch(tendenciasEndPoint + '&api_key=' + apiKey )
        .then((response) => {
            return response.json()
        })
        .then(data => {
            var datos = data.data
            mostrarTendencias(datos)
            return datos
        })
        .catch((error) => {
            return error
        })

    return found
}

function mostrarTendencias(data) {

    let gridTendencias = document.getElementById('tendencias');
    //creo los elementos html
    data.forEach(element => {
        let tarjeta = document.createElement('div');
        tarjeta.setAttribute('class', "gifCard");
        tarjeta.innerHTML +=
            '<img src =' + element.images.downsized.url + '>' +
            ' <div class = "foot">' +
            ' <p>' + element.title + '</p>' +
            '</div>'
        gridTendencias.appendChild(tarjeta);
    });
}

/******************************************* Barra Busqueda **************************************************/

// Eventos en input
function enter() {
    if (event.keyCode == 13) {
        buscar(inputBusqueda.value.trim());
        return;
    }
}

// funcion para saber si hay algo en el input

function estadoInput() {
    let valor = inputBusqueda.value.trim();

    if (valor) {
        document.getElementById("btn-search").disabled = false;
        obtenerSugerencias(valor);
    } else {
        document.getElementById("btn-search").disabled = true;
        mostEsconComponet(divSug, esconder);
    }
}

//Eventos boton lupa
function comenzarBusqueda() {
    buscar(inputBusqueda.value, mostrarResultados);

}

// Ejecucion de la busqueda de gifs

async function buscar(palabra) {
    //guardo el texto buscado
    document.getElementById("tex-buscado").innerText = palabra + ' (resultados)';
    inputBusqueda.value = palabra;
    //obtengo nuevas sugerencias con la palabra buscada
    obtenerSugerencias(palabra);

    const found = await fetch(searchEndPoint + 'q=' + palabra + '&api_key=' + apiKey + "&limit=" + limitebusqueda)
        .then((response) => {
            return response.json();
        })
        .then(data => {
            var datos = data.data;
            mostrarResultados(datos);
            return datos;
        })
        .catch(error => {
            return error
        })

    return found
}

function mostrarResultados(data) {
    //muestro toda la galeria de los gif
    mostEsconComponet(divSug, esconder);
    mostEsconComponet(document.getElementById('busqueda'), mostrar);

    let gridBusqueda = document.getElementById('gridBusqueda');

    //borro los resultados anteriores
    while (gridBusqueda.firstChild) {
        gridBusqueda.removeChild(gridBusqueda.firstChild);
    }

    if (data.length == 0) {
        let tarjeta = document.createElement('div');
        tarjeta.setAttribute('class', 'gifCard');
        tarjeta.innerHTML +=
            '<div class = "foot">' +
            '<p>No se encontraron resultados</p>' +
            '</div>';
        gridBusqueda.appendChild(tarjeta);

    } else {
        //creo los elementos html
        data.forEach(element => {
            let tarjeta = document.createElement('div');
            tarjeta.setAttribute('class', 'gifCard');

            tarjeta.innerHTML +=

                ' <img src =' + element.images.downsized.url + '>' +
                ' <div class = "foot">' +
                '  <p>' + element.title + '</p>' +
                ' </div>';

            gridBusqueda.appendChild(tarjeta);
        });

    }
}

// Funciones para obtener palabras sugeridas

function obtenerSugerencias(palabra, callback) {

    //creo la URL para la consulta
    let url = segBusqUrl + '&q=' + palabra;
    //llamo la funcion que me actualiza el scrip
    actulizarScript(url, callback);
}

function actulizarScript(url, callback) {
    console.log("insertando el scrip");
    //creo el nuevo script
    let nuevoScript = document.createElement("script");

    // le asigno la url y un id
    nuevoScript.setAttribute("src", url);
    nuevoScript.setAttribute("id", "jsonp");
    //busco si ya existe
    let viejoScript = document.getElementById("jsonp");

    // seciono el body
    let body = document.getElementsByTagName("body")[0];

    if (viejoScript == null) {
        //si no hay ningulo le pego el nuevo
        body.appendChild(nuevoScript);
    } else {
        // si ya existe lo remplazo
        body.replaceChild(nuevoScript, viejoScript);
    }

}

function mostrarJsonp(obj) {
    arraySugBus = obj[1];
    colocarSugBus(arraySugBus);

}

// Funciones caja de palabras sugeridas

function colocarSugBus(sugArr) {

    //borro todas las anteriores
    while (wrapSugerencias.firstChild) {
        wrapSugerencias.removeChild(wrapSugerencias.firstChild);
    }

    //si no hay resultados no lo muestro
    if (sugArr.length == 0) {

        mostEsconComponet(divSug, esconder);

    } else {
        // si hay lo muestro
        mostEsconComponet(divSug, mostrar);

        if (sugArr.length >= maxsug) {
            for (let index = 0; index < maxsug; index++) {
                insertarBtnSug(sugArr[index]);
            }

        } else {
            for (let index = 0; index < sugArr.length; index++) {
                insertarBtnSug(sugArr[index]);
            }
        }

    }

}

function insertarBtnSug(texto) {
    let boton = document.createElement('button');
    boton.setAttribute('class', 'btn-search-predictions');
    boton.setAttribute('onclick', 'buscar("' + texto + '")');
    boton.textContent = texto;
    wrapSugerencias.appendChild(boton);
}


