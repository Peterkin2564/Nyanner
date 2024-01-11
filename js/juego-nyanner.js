//----------------------------variables-----------------------------------
//variable de canvas
let canvas;
let ctx;
//variables barra puntos
//var tiempo
const DEFAULT_SEGUNDOS = 45
let segundos = DEFAULT_SEGUNDOS;
let vidas = 3;
let michis = 0;
//variables para img
let imgPersonajeUno = new Image();
let imgMichiCalle = new Image();
let imgMichiCalleDos = new Image();
let imgMichiCalleTres = new Image();
let imgMichiCalleCuatro = new Image();
let imgMichiCalleCinco = new Image();
let imgCorazon = new Image();
let imgMichiContador = new Image();
let imgAutoUno = new Image();
let imgAutoDos = new Image();
let imgAutoTres = new Image();
let imgAutoCuatro = new Image();
//variable para los audios
let audioPerdida;
let audioPuntos;
let audioGanaste;
let audioBackground;
let audioMichi;
let audioBocinazo;
//variable boton
let colorBoton = "#272522"
//variables personaje
//valores iniciales
let VELOCIDAD_MICHI_SPAWN = 2200
let alturaInicial = 70;
let anchoInicial = 62;
let posXPer = 400;
let contadorMichis = 0
let posYPer = 390;
//variable pantallas
let estaEnPantallaPerdiste = false;
let estaEnPantallaTimeOut = false;
let estaEnInicio = true;
let estaEnPantallaGanaste = false;
//establecer ubicacion de michi de la calle (img)
imgMichiCalle.src = "img-2/michi-bb-gris-rayado.png";
imgMichiCalleDos.src = "img-2/michi-bb-siames.png";
imgMichiCalleTres.src = "img-2/michi-bb-tricolor.png";
imgMichiCalleCuatro.src = "img-2/michi-bb-gris.png";
imgMichiCalleCinco.src = "img-2/michi-bb-blanco-negro.png";
//var personajes
let personajeUno = new Personaje(posXPer, posYPer, anchoInicial, alturaInicial); //x,y,ancho,alto,imagen
let michiCalleUno = new MichiCalle(569, 290, 22, 32, imgMichiCalle, "michiCalle")
let michiCalleDos = new MichiCalle(500, 125, 22, 32, imgMichiCalleDos, "michiCalleDos", true)
let michiCalleTres = new MichiCalle(420, 293, 22, 32, imgMichiCalleTres, "michiCalleTres", true)
let michiCalleCuatro = new MichiCalle(50, 130, 22, 32, imgMichiCalleCuatro, "michiCalleCuatro", true)
let michiCalleCinco = new MichiCalle(150, 8, 22, 32, imgMichiCalleCinco, "michiCalleCinco", true)
//var contadores
let corazon = new Logos(560, 18, 38, 33, imgCorazon);
let michisRescatados = new Logos(670, 16, 55, 40, imgMichiContador);
//var para mintervalos
let autoRojo = new Auto(850, 180, 65, 45, imgAutoUno, "autoRojo");
let autoGris = new Auto(-150, 230, 65, 45, imgAutoDos, "autoGris");
let autoCeleste = new Auto(1100, 348, 65, 45, imgAutoTres, "autoCeleste");
let autoVerdeLima = new Auto(-600, 57, 65, 45, imgAutoCuatro, "autoVerdeLima");
let desactivarSpawn = false
//var intervalos
let intervaloSpawnMichis = null;
let intervaloAutos = null
//var audios
audioPerdida = new Audio();
audioPerdida.src = "audio/game_over.mp3"
audioPuntos = new Audio()
audioPuntos.src = "audio/maullido.mp3"
audioGanaste = new Audio()
audioGanaste.src = "audio/ronroneo.mp3"
audioBackground = new Audio()
audioBackground.volume = 0.3;
audioBackground.src = "audio/backgroundmusic.mp3"
audioMichi = new Audio();
audioMichi.src = "audio/michi_enojado.mp3"
audioBocinazo = new Audio()
audioBocinazo.src = "audio/auto_bocinazo.mp3"
audioBocinazo.volume = 0.2;
//var posicion boton
const posicionBoton = {  // Objeto simple
    xInicial: 360,
    xFinal: 445,
    yInicial: 300,
    yFinal: 400,
}
//var timer
let timer2 = null
//funcion de temporizador
function getTime() {
    if (segundos < 10) {
        return "00:0" + segundos
    }
    return "00:" + segundos
}
//que la pág este cargada
window.onload = function () {
    //pantalla inicio
    dibujarPantallaInicio();
}
//funcion cargar y vincular imgs
function cargarImagenes() {
    //ubicacion corazon (img)
    imgCorazon.src = "img-2/corazon-vida.png";
    imgCorazon.onload = function () {
        corazon.dibujarLogos();
    }

    //ubicacion contador-michis
    imgMichiContador.src = "img-2/michi-contador.png";
    imgMichiContador.onload = function () {
        michisRescatados.dibujarLogos();
    }

    //establecer ubicacion de jugador (img)
    imgPersonajeUno.src = "img-2/sprite-michi-usuario-3.png";
    imgPersonajeUno.onload = function () {
        personajeUno.dibujarPersonaje();
    }
    //establecer ubicacion auto (img)
    //rojo
    imgAutoUno.src = "img-2/auto-rojo.png";
    imgAutoUno.onload = function () {
        autoRojo.dibujarAuto();
    }
    //gris
    imgAutoDos.src = "img-2/auto-gris.png";
    imgAutoDos.onload = function () {
        autoGris.dibujarAuto();
    }
    //celeste
    imgAutoTres.src = "img-2/auto-celeste.png";
    imgAutoTres.onload = function () {
        autoCeleste.dibujarAuto();
    }
    //verde lima
    imgAutoCuatro.src = "img-2/auto-verde-lima.png"
    imgAutoCuatro.onload = function () {
        autoVerdeLima.dibujarAuto();
    }
}

//----------------------------juego-----------------------------------
function estaEnPantallaPrincipal() {
    return (estaEnPantallaGanaste || estaEnPantallaPerdiste || estaEnPantallaTimeOut)
}
function clear_all_intervals() {
    clearInterval(intervaloAutos);
    clearInterval(timer2)
    //console.log("clearing", squadMichisDelBarrio.obtenerGatoActivo().michiNuevaPos)
    clearInterval(squadMichisDelBarrio.obtenerGatoActivo().michiNuevaPos)
}
function reinicializar_variables() {
    vidas = 3
    contadorMichis = michis
    michis = 0
    personajeUno.x = posXPer
    personajeUno.y = posYPer
    //squadMichisDelBarrio.obtenerGatoActivo().desactivado =  true
    squadMichisDelBarrio.indiceGatoActivo = 0
    squadMichisDelBarrio.obtenerGatoActivo().aunNoSeMovio = true
    // squadMichisDelBarrio.
    segundos = DEFAULT_SEGUNDOS
    ctx.clearRect(0, 0, canvas.width, canvas.height); //borrar barrido
}
function timer() {
    timer2 = setInterval(() => {

        if (!estaEnPantallaPrincipal()) {
            segundos--
            dibujarBarraPuntos()

            if (segundos === 0) {
                reinicializar_variables()
                clear_all_intervals()
                //se puede mejorar
                estaEnInicio = false;
                estaEnPantallaGanaste = false;
                estaEnPantallaPerdiste = false;
                //setear nueva pantalla
                estaEnPantallaTimeOut = true;
                audioPerdida.play()
                audioBackground.pause()
            }
        }
        //console.log(segundos)
    }, 1000);
}
function limpiarCanvas() {
    clear_all_intervals()
    reinicializar_variables()

}
function dibujarMapaJuego() {
    //dibujar el resto de elementos
    //correr por el array de michis
    let gatoActivo = squadMichisDelBarrio.obtenerGatoActivo()
    gatoActivo.desactivado = false
    dibujarBarraPuntos();
    autoRojo.dibujarAuto();
    autoGris.dibujarAuto();
    autoCeleste.dibujarAuto();
    autoVerdeLima.dibujarAuto();
    corazon.dibujarLogos();
    michisRescatados.dibujarLogos();
    personajeUno.dibujarPersonaje();
    gatoActivo.dibujarMichiCalle()
}
function moverAutos() {
    //que se muevan
    autoRojo.mover()
    autoGris.moverHaciaDerecha()//contramano
    autoCeleste.mover()
    autoVerdeLima.moverHaciaDerecha()//contramano

}
function movimientos() {
    intervaloAutos = setInterval(function () {
        let gatoActivo = squadMichisDelBarrio.obtenerGatoActivo()
        ctx.clearRect(0, 0, 800, 450); //borrar barrido
        moverAutos()
        //colision
        autoRojo.colision()
        autoGris.colision()
        autoCeleste.colision()
        autoVerdeLima.colision()
        if (vidas > 0) {
            dibujarMapaJuego()
        } else {
            gatoActivo.aunNoSeMovio = true
            dibujarPantallaPerdiste();
        }
    }, 15);
}
function jugar() {
    //selecciono el canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.backgroundImage = "url(img-2/fondo-nuevo-light-2.png)";
    cargarImagenes()
    audioBackground.play()
    timer()
    movimientos()
}

//-------------------------objetos-clases----------------------------
//barra de puntos
function dibujarBarraPuntos() {
    //timer
    ctx.font = "20px fuenteCute";
    //cambio estilos txt
    if (segundos <= 25 && segundos > 10) {
        console.log("segundos", segundos)
        ctx.fillStyle = "#fff2b3";
    }
    if (segundos <= 15) {
        ctx.fillStyle = "#ffc45d";
    }
    ctx.fillText("Tiempo: " + getTime(), 420, 40);
    ctx.fillStyle = "#ffffff"
    //vidas
    ctx.font = "20px fuenteCute";
    ctx.fillText(vidas + " / 3", 610, 40);
    //vidas
    ctx.font = "20px fuenteCute";
    ctx.fillText(michis + " / 5", 730, 40)
}
//lista de michis
function MichiSquad(listaMichis) {

    this.listaMichis = listaMichis
    this.contador = 0 //que arranque en posicion 0 
    this.indiceGatoActivo = 0 //posicion de michi actual

    this.obtenerGatoActivo = function () {
        //si llega el ultimo, tomar el primero (en 5 corta) 
        if (this.indiceGatoActivo >= this.listaMichis.length) {
            this.indiceGatoActivo = 0
        }
        return this.listaMichis[this.indiceGatoActivo]
    }

    this.pasarASiguienteMichi = function () {
        if (this.indiceGatoActivo >= this.listaMichis.length) {
            this.indiceGatoActivo = 0
        }
        this.indiceGatoActivo = this.indiceGatoActivo + 1
    }

    this.obtenerMichiSiguiente = function () {
        if (contador > listaMichis.length) {
            contador = 0
        }
        let michiSiguiente = listaMichis[c]

        contador++
        return michiSiguiente
    }

}
//array llamado michis post colision
let squadMichisDelBarrio = new MichiSquad([michiCalleUno, michiCalleDos, michiCalleTres, michiCalleCuatro, michiCalleCinco])
//logos barra puntos
function Logos(x, y, ancho, alto, imagen) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.imagen = imagen;
    this.dibujarLogos = function () {
        ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
    }

}
//auto
function Auto(x, y, ancho, alto, imagen, tipo) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.imagen = imagen;
    this.tipo = tipo;
    this.dibujarAuto = function () {
        ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
    }
    this.mover = function () {
        if (this.x > - 100) {
            this.x -= 3;
        } else {
            this.x = 1000
        }
    }
    this.moverHaciaDerecha = function () {
        if (this.x < 1000) {
            this.x += 3;
        } else {
            this.x = -60
        }
    }
    this.colision = function () {
        if (
            (this.x > personajeUno.x - this.ancho)
            && (this.x < personajeUno.x + personajeUno.ancho)
            && (this.y > personajeUno.y - 40)
            && (this.y < personajeUno.y + 40)
        ) {

            this.x = 1500;
            vidas = vidas - 1;
            audioBocinazo.play()
            audioMichi.play()

            personajeUno.irArriba()
            //reinicio posicion si colisiona
            personajeUno.x = posXPer
            personajeUno.y = posYPer
            //pantalla perder
            if (vidas < 1) {
                estaEnInicio = false;
                estaEnPantallaGanaste = false;
                estaEnPantallaPerdiste = true;

                limpiarCanvas()
                audioPerdida.play()
                audioBackground.pause()
            }
        }
    }

}
//personaje-michi-usuario
function Personaje(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.posicion = 0;
    this.altoRecorte = alto;
    this.anchoRecorte = ancho;

    //sprite-michi-usuario
    this.dibujarPersonaje = function () {
        ctx.drawImage(
            imgPersonajeUno,
            this.posicion * this.ancho, //donde empieza el recorte en x
            0, //donde empieza el recorte en y
            this.anchoRecorte, //ancho del recorte
            this.altoRecorte,//alto del recorte
            this.x,//ubicacion del personaje en x
            this.y,//ubicacion del personaje en y
            this.ancho,//ancho de la imagen
            this.alto //alto de la imagen
        );
    }

    this.irDerecha = function () {
        let estaFueraDelMapa = (this.x > canvas.width - 80)
        if (!estaFueraDelMapa) {
            this.posicion = 2;
            this.x += 22;

        }
        //console.log("Ir derecha");
    }
    this.irIzquierda = function () {
        let estaFueraDelMapa = (this.x < 10)
        if (!estaFueraDelMapa) {
            this.posicion = 3;
            this.x -= 22;
        }
        //console.log("Ir izquierda");
    }
    this.irAbajo = function () {
        let estaFueraDelMapa = (this.y > 380)
        if (!estaFueraDelMapa) {
            this.posicion = 1;
            this.y += 22;
        }
        //console.log("Ir abajo");
    }
    this.irArriba = function () {
        let estaFueraDelMapa = this.y < 0
        if (!estaFueraDelMapa) {
            this.posicion = 0;
            this.y -= 22;
        }
        //console.log("Ir arrriba");
    }
}
//array posiciones de michis random
let arrayPosiciones = [{ x: 755, y: 295 }, { x: 326, y: 120 }, { x: 680, y: 405 }, { x: 29, y: 295 }, { x: 30, y: 5 }]
let posicionRandom = { x: 0, y: 0 };
let numeroRandom = 0;
let indiceRandom = 0;
let largoArray = 0;
let randomX = 0;
let randomY = 0;
function getRandomElement(array) {
    largoArray = array.length
    numeroRandom = (Math.random() * largoArray)
    indiceRandom = Math.floor(numeroRandom)
    return arrayPosiciones[indiceRandom]
}
//personaje-michi-calle
function MichiCalle(x, y, ancho, alto, imagen, tipo, desactivado = false) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.imagen = imagen;
    this.tipo = tipo;
    this.desactivado = desactivado; //this.imagen = "" desaparece
    this.aunNoSeMovio = true;
    this.michiNuevaPos = null;
    this.dibujarMichiCalle = function () {

        if (!this.desactivado) {
            ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
        }
        //SE EJECUTA 1 SOLA VEZ
        if (this.aunNoSeMovio) {
            console.log("moviendo")
            this.aunNoSeMovio = false
            this.michiNuevaPos = setInterval(() => {
                let posicionNueva = getRandomElement(arrayPosiciones)
                this.x = posicionNueva.x
                this.y = posicionNueva.y
                ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
            }, VELOCIDAD_MICHI_SPAWN);
        }
    }
    this.colision = function () {
        if (
            (this.x > personajeUno.x - this.ancho)
            && (this.x < personajeUno.x + personajeUno.ancho)
            && (this.y > personajeUno.y - this.alto)
            && (this.y < personajeUno.y + personajeUno.alto)
        ) {
            //deja de dibujar n de barra de puntos y frena el conteo 
            if (!this.desactivado) {
                michis = michis + 1;
                this.desactivado = true;
                clearInterval(this.michiNuevaPos)
                squadMichisDelBarrio.pasarASiguienteMichi()
                squadMichisDelBarrio.obtenerGatoActivo().aunNoSeMovio = true
                audioPuntos.play()

                if (michis === 5) {
                    limpiarCanvas()
                    estaEnPantallaGanaste = true;
                    audioGanaste.play()
                    audioBackground.pause()
                }
            }
        }
    }

}

//------------------------pantallas---------------------------------
//pantalla inicio
function dibujarPantallaInicio() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.backgroundImage = "url(img-2/fondo-inicio-3.png)";

}
function dibujarBotonJugar() { // dibujado 
    //color
    ctx.fillStyle = colorBoton;
    ctx.font = "20px fuenteCute"; //establezco tam y fuente
    ctx.fillText("JUGAR", 370, 340);
}
//chequear posicion cursor en boton
function chequearSiEstaEnRango(posicionClick, posicionBoton) { //que devuelve? true 

    let estaEnRangoX = posicionClick.x >= posicionBoton.xInicial && posicionClick.x <= posicionBoton.xFinal
    let estaEnRangoY = posicionClick.y >= posicionBoton.yInicial && posicionClick.y <= posicionBoton.yFinal;

    /*
        let estaEnRangoX = posicionBoton.posicionXInicial >= 370 && posicionX <= 442;
        let estaEnRangoY = posicionY >= 284 && posicionY <= 309;
    */

    if (estaEnRangoX && estaEnRangoY) { //booleano 
        return true; //termina la funcion 
    } else {//le puse un else solo por TOC perdón jaja
        return false; //si no se activa termina la funcion aca
    }
}
//pantalla perdiste por colision 
function dibujarPantallaPerdiste() {
    canvas.style.backgroundImage = "url(img-2/fondo-perdiste-2.png)";
    dibujarSubtituloPerdiste();
    dibujarBotonPerdisteReiniciar();
    audioGanaste.pause()
}
//pantalla perdiste por tiempo
function dibujarPantallaTimeOut() {
    canvas.style.backgroundImage = "url(img-2/fondo-intro.png)";
    //titulo
    ctx.fillStyle = "#fff9dc";
    ctx.font = "50px fuenteCute"; //establezco tam y fuente
    ctx.fillText("Te quedaste sin tiempo", 120, 200);
    dibujarSubtituloPerdiste();
    dibujarBotonPerdisteReiniciar();
    audioGanaste.pause()
}
//contador michis ganados
function dibujarSubtituloPerdiste() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px fuenteCute"; //establezco tam y fuente
    ctx.fillText("Michis: " + contadorMichis, 370, 260);
}
//boton reiniciar compartido por los dos pantallas perdiste
function dibujarBotonPerdisteReiniciar() {
    //boton
    ctx.fillStyle = colorBoton;
    ctx.font = "20px fuenteCute"; //establezco tam y fuente
    ctx.fillText("REINICIAR", 365, 340);
}
//pantalla ganaste
function dibujarPantallaGanaste() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.backgroundImage = "url(img-2/fondo-ganaste-3.png)";
    dibujarBotonGanasteReiniciar()
}
//boton reiniciar
function dibujarBotonGanasteReiniciar() {
    //boton
    ctx.fillStyle = colorBoton;
    ctx.font = "20px fuenteCute"; //establezco tam y fuente
    ctx.fillText("REINICIAR", 370, 340);
}

//---------------------escuchadores---------------------------------
//escuchadores personaje-perder-ganar
document.addEventListener("keydown", function (e) {
    //info: https://medium.com/swlh/return-early-pattern-3d18a41bba8
    if (estaEnInicio) {  // early return - interrumpir si esta en inicio 
        return null
    }

    michiCalleUno.colision()
    michiCalleDos.colision()
    michiCalleTres.colision()
    michiCalleCuatro.colision()
    michiCalleCinco.colision()
    autoRojo.colision()
    autoGris.colision()
    autoCeleste.colision()
    autoVerdeLima.colision()

    switch (e.key) {
        case "a":
            personajeUno.irIzquierda();
            break;
        case "d":
            personajeUno.irDerecha();
            break;
        case "s":
            personajeUno.irAbajo();
            break;
        case "w":
            personajeUno.irArriba();
            break;
    }
})

function estaEnPantallaMenu() {
    return estaEnInicio || estaEnPantallaPerdiste || estaEnPantallaGanaste || estaEnPantallaTimeOut
}

function salirDePantallaMenu() {
    estaEnInicio = false;
    estaEnPantallaPerdiste = false;
    estaEnPantallaGanaste = false
    estaEnPantallaTimeOut = false
}
//escuchador pantalla-boton-click
document.addEventListener("click", function (e) {

    let estaEnRango = chequearSiEstaEnRango(posicionClick, posicionBoton);

    if (estaEnRango && estaEnPantallaMenu()) { // si no es inicio, no hace nada.

        salirDePantallaMenu()
        limpiarCanvas()
        jugar();
        audioBackground.play();
        return null; // early return
    }
});

let posicionClick = {
    x: 0,
    y: 0
};
//detecta la posicion del mouse
document.addEventListener("mousemove", function (e) {
    posicionClick = {  //posicion teniendo en cuenta la resolucion
        x: e.offsetX,
        y: e.offsetY
    }
    //console.log("click", posicionClick)
});
//cambio de estilos en boton
function hoverBoton(colorInicial, colorFinal) {
    let estaEnRango = chequearSiEstaEnRango(posicionClick, posicionBoton);
    //si lo esta, hace esto on hover
    if (estaEnRango) {
        canvas.style.cursor = "pointer";
        colorBoton = colorInicial;

    } else { //default
        canvas.style.cursor = "";
        colorBoton = colorFinal;

    }
}
//este intervalo se ejecuta para detectar la posicion del mouse y diujar los botones segun corresponda
setInterval(function () {
    if (estaEnPantallaMenu()) { //primero chequea si esta en alguna de las tres pantallas

        ctx.clearRect(0, 0, canvas.width, canvas.height); //sin esto se solapan las palabras de los botones 

        //esta en pantalla inicio?
        if (estaEnInicio) {
            hoverBoton("#fbecce", "#272522");
            dibujarBotonJugar()
            return null
        }

        if (estaEnPantallaPerdiste) {
            dibujarPantallaPerdiste(); //primero dibuja la pantalla de perdida
            hoverBoton("#ffc45d", "#ffffff");
            dibujarBotonPerdisteReiniciar()
            return null
        }

        if (estaEnPantallaTimeOut) {
            hoverBoton("#ffc45d", "#ffffff");
            dibujarPantallaTimeOut();
            dibujarBotonPerdisteReiniciar()
            return null
        }

        if (estaEnPantallaGanaste) {
            hoverBoton("#ffc45d", "#ffffff");
            dibujarPantallaGanaste();
            dibujarBotonGanasteReiniciar()
            return null
        }
    }
}, 15);


