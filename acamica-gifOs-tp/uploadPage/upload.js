// Cuando carga la pagina

window.onload = function() {
    //ver si existen gif guardados

    if (localStorage.getItem('GifList')) {

        cargarLocalStorageGif(gridGifSubidosUpload);

    } else {
        //no hay gif
        console.log('No existen gifs guardados');
    }

}

// Elemntos del DOM
const video = document.getElementById('video');
const videoGuardado = document.getElementById('videoGuardado');

// Variables para grabacion
var blob;
var grabacion;
var miCamara;
var data;

// Timer
var horaComienzo;

// Mis Gifs
var misGif = [];
var gridGifSubidosUpload = document.getElementById('misGif');

// Eventos Botones

function arrowBack () {
    location.assign('../homePage/gifOS.html')
}

function backHome () {
    location.assign('../homePage/gifOS.html')
}

function cancel() {
    location.assign('../uploadPage/upload.html')
}

// Funciones para empezar a grabar

function vistaPrevia() {
    // escondo elementos - funcion en main.js
    mostEsconComponet(document.getElementById('frame'), esconder);
    mostEsconComponet(document.getElementById('bars'), esconder);
    mostEsconComponet(document.getElementById('foot-subir'), esconder);
    // muestro elementos
    mostEsconComponet(document.getElementById('video-frame'), mostrar);
    mostEsconComponet(document.getElementById('firstTitle'), mostrar);

    return;
}

function permisoCamara() {

    //obtengo el video de la camara
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    })
        .then (function(stream) {

            miCamara = stream;
            video.srcObject = miCamara;
        })
        .catch(console.error)
}

function comenzarGrabacion() {
    //defino donde se graba 
    grabacion = crearGrabador(miCamara);
    // escondo y muestro elementos
    mostEsconComponet(document.getElementById('firstTitle'), esconder);
    mostEsconComponet(document.getElementById("foot-comenzar"), esconder);
    mostEsconComponet(document.getElementById('secondTitle'), mostrar);
    mostEsconComponet(document.getElementById("foot-parar"), mostrar);

    //funcion que graba
    grabacion.startRecording();
    horaComienzo = new Date().getTime();

    temporizador();
    return;
}

function terminarGrabacion() {

    // Muestro y escondo elementos cuadros
    mostEsconComponet(document.getElementById("secondTitle"), esconder);
    mostEsconComponet(document.getElementById("thirdTitle"), mostrar);
    mostEsconComponet(document.getElementById("foot-parar"), esconder);
    mostEsconComponet(document.getElementById("foot-subir"), mostrar);

    grabacion.stopRecording(() => {

        //guado la informacion grabada
        blob = grabacion.getBlob();
        //lo pongo para que se muestre
        videoGuardado.src = grabacion.toURL();
        // muestro y escondo elementos
        mostEsconComponet(document.getElementById("videoGuardado"), mostrar);
        mostEsconComponet(document.getElementById("video"), esconder);

        //reset de grabacion      
        grabacion.destroy();
        grabacion = null;
        // deja de usar la camara
        miCamara.getTracks().forEach(function(track) {
            track.stop();
        });

    });
}

function crearGrabador(transmision) {
    return RecordRTC(transmision, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        timeSlice: 1000,
    });
}

function recapturar() {
    // escondo elementos
    mostEsconComponet(document.getElementById("thirdTitle"), esconder);
    mostEsconComponet(document.getElementById("foot-subir"), esconder);
    mostEsconComponet(document.getElementById('videoGuardado'), esconder);
    // muestro nuevamente
    mostEsconComponet(document.getElementById('video'), mostrar);
    mostEsconComponet(document.getElementById('foot-comenzar'), mostrar);

    permisoCamara();
}

// Funciones para timer

function temporizador() {
    //si no esxiste grabacion, salir 
    if (!grabacion) {
        return;
    }

    document.getElementById('timertag').innerText = calcularDuracion((new Date().getTime() - horaComienzo) / 1000);
    setTimeout(temporizador, 1000);

}

function calcularDuracion(segundos) {

    let hr = Math.floor(segundos / 3600);
    let min = Math.floor((segundos - (hr * 3600)) / 60);
    let seg = Math.floor(segundos - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = '0' + min;
    }

    if (seg < 10) {
        seg = '0' + seg;
    }

    if (hr <= 0) {
        return min + ':' + seg;
    }

    return hr + ':' + min + ':' + seg;
}

// Subir el gif

function subirGif() {
    // Escondo y muestro elementos
    mostEsconComponet(document.getElementById("video-frame"), esconder);
    mostEsconComponet(document.getElementById("cartel-subida"), mostrar);

    //configuracion de la informacion de envio
    data = new FormData();
    data.append('file', blob, 'misGif.gif');
    // Metodo POST
    var parametros = {
        method: 'POST',
        body: data,
    };
    //creo la direccion con los parametros
    let URL = subidaEndPoint + '&api_key=' + apiKey + '&username' + userName;

    const found = fetch(URL, parametros)
        .then( async response => {
            //llamar a funcion que muestra el gif final
            mostrarcartelDescargar();
            return response.json();
        }).then(datos => {
            guandarGifLocalStorage(datos.data.id);
        })

    .catch(error => {
        console.log(error);
        return error;
    });
    return found;
}

function mostrarcartelDescargar() {
    //esconder carteles anteriores
    mostEsconComponet(document.getElementById("cartel-subida"), esconder);
    mostEsconComponet(document.getElementById("cartel-muestr-desc"), mostrar);

    //guardar el gif en local storage y mostrar en pantalla
    let gifURL = URL.createObjectURL(blob);
    document.getElementById('muestra-gif').src = gifURL;
}

function guandarGifLocalStorage(id) {
    //traigo el gif completo con este id
    fetch(buscarPorId + id + '?' + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(dataGif => {

            let url = dataGif.data.images.downsized.url
                //guardar enlace en el boton 
            document.getElementById("btn-copiarEnlace").setAttribute('value', url);

            // chequeo si hay algo guardado
            if (localStorage.getItem('GifList')) {
                //me traigo lo que hay en el llocal storage
                misGif = JSON.parse(localStorage.getItem('GifList'));
                // le agrego el nuevo valor
                misGif.push(url);
                //lo guardo de nuevo
                localStorage.setItem('GifList', JSON.stringify(misGif));
            } else {
                misGif.push(url);
                localStorage.setItem('GifList', JSON.stringify(misGif));
            }
        });
}

function cancelarSubida() {

    mostEsconComponet(document.getElementById('cartel-subida'), esconder);
    // llamo a la funcion para volver a capturar
    permisoCamara();

}

function gifTerminado() {
    // escondo todo, muestro galeria mis gifs
    mostEsconComponet(document.getElementById("cartel-muestr-desc"), esconder);
    window.location.replace("../misGuifos/mis-gif.html");

}

function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif');

}





