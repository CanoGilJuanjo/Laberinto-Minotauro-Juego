document.addEventListener("DOMContentLoaded",()=>{
    /**
     * Valores reservados en el Mapa
     * Jugador: 3
     * Enemigo: 2
     * Vacio: 0
     * Encendido: 1
     * Tesoro: 4
     */
    const MAX_CELDAS = 33; //ANCHO x ALTO del mapa
    var mapa = []; //Array vacio que rellenaremos con el mapa
    const DENSIDAD_MAPA = 4; //Inversamente proporcional. A mayor numero menor densidad
    var mapaDibujo = document.querySelector("#mapa"); //Variable que almacena la referencia del mapa que se representa a partir del mapa interno del juego
    var control = false;

    var jugador = {
        posicionI: 0,
        posicionJ: 0,
        muerto: false,
        direccion:"w"
    }

    var tesoro = {
        posicionI: 0,
        posicionJ: 0,
        recogido: false
    }

    var minotauro = {
        posicionI : 0,
        posicionJ : 0,
        direccion: "w" //w,a,s,d 
    }

    //Primer procesado del mapa - Generador puntos origen
    for(let i = 0; i<MAX_CELDAS;i++){
        mapa.push([]);
        for(let j = 0;j<MAX_CELDAS;j++){
            if(Math.floor(Math.random()*DENSIDAD_MAPA) == 1){
                mapa[i].push(1)
            }else{
                mapa[i].push(0)
            }
        }
    }

     //Segundo procesado del mapa - Horizontal|Vertical
    for(let i = 0; i<MAX_CELDAS;i++){
        for(let j = 0;j<MAX_CELDAS;j++){
            contador = 0;
            if(mapa[i][j] == 0){
                if(i<MAX_CELDAS-1 && mapa[i+1][j] == 1){ //Derecha
                    contador++;
                }
                if(i>0 && mapa[i-1][j] == 1){//Izquierda
                    contador++;
                }
                if(j<MAX_CELDAS-1 && mapa[i][j+1] == 1){//Abajo
                    contador++;
                }
                if(j>0 && mapa[i][j-1] == 1){//Arriba
                    contador++;
                }
            }
            if(contador == 2){
                mapa[i][j] = 1;
            }
        }
    }

    //Tercer procesado del mapa - Diagonales
    for(let i = 0; i<MAX_CELDAS;i++){
        for(let j = 0;j<MAX_CELDAS;j++){
            contador = 0;
            if(mapa[i][j] == 0){
                if(i+1<=MAX_CELDAS-1 && j+1<=MAX_CELDAS-1 && mapa[i+1][j+1] == 1){ //Derecha-Abajo
                    contador++;
                }
                if(i-1>=0 && j+1<=MAX_CELDAS-1 && mapa[i-1][j+1] == 1){ // Izquierda-Abajo
                    contador++;
                }
                if(i-1>=0 && j+1<=MAX_CELDAS-1 && mapa[i-1][j+1] == 1){//Derecha-Arriba
                    contador++;
                }
                if(i-1>=0 && j-1>=0 && mapa[i-1][j-1] == 1){//Izquierda-Arriba
                    contador++;
                }
            }
            if(contador == 2){
                mapa[i][j] = 1;
            }
        }
    }

    //Limpieza 1
    for(let i = 0; i<MAX_CELDAS;i++){
        for(let j = 0;j<MAX_CELDAS;j++){
            contador = 0;
            if(mapa[i][j] == 1){
                if(i+1<=MAX_CELDAS-1 && mapa[i+1][j] == 1){ //Derecha
                    contador++;
                }
                if(i-1>=0 && mapa[i-1][j] == 1){//Izquierda
                    contador++;
                }
                if(j+1<=MAX_CELDAS-1 && mapa[i][j+1] == 1){//Abajo
                    contador++;
                }
                if(j-1>=0 && mapa[i][j-1] == 1){//Arriba
                    contador++;
                }
            }
            if(contador < 2){
                mapa[i][j] = 0;
            }
        }
    }

    //Limpieza 2
    for(let i = 0; i<MAX_CELDAS;i++){
        for(let j = 0;j<MAX_CELDAS;j++){
            contador = 0;
            if(mapa[i][j] == 1){
                if(i+1<=MAX_CELDAS-1 && mapa[i+1][j] == 1){ //Derecha
                    contador++;
                }
                if(i-1>=0 && mapa[i-1][j] == 1){//Izquierda
                    contador++;
                }
                if(j+1<=MAX_CELDAS-1 && mapa[i][j+1] == 1){//Abajo
                    contador++;
                }
                if(j-1>=0 && mapa[i][j-1] == 1){//Arriba
                    contador++;
                }
            }
            if(contador < 2){
                mapa[i][j] = 0;
            }
        }
    }

    //Pocionamiento del jugador
    do{
        jugador.posicionI = Math.floor(Math.random()*MAX_CELDAS)
        jugador.posicionJ = Math.floor(Math.random()*MAX_CELDAS)
    }while(mapa[jugador.posicionI][jugador.posicionJ] == 0);
    mapa[jugador.posicionI][jugador.posicionJ] = 3;

    //Posicionamiento del tesoro
    do{
        tesoro.posicionI = Math.floor(Math.random()*MAX_CELDAS)
        tesoro.posicionJ = Math.floor(Math.random()*MAX_CELDAS)
    }while(mapa[tesoro.posicionI][tesoro.posicionJ] == 0 || mapa[tesoro.posicionI][tesoro.posicionJ] == 3);
    mapa[tesoro.posicionI][tesoro.posicionJ] = 4;

    //Posicionamiento del minotauro
    do{
        minotauro.posicionI = Math.floor(Math.random()*MAX_CELDAS)
        minotauro.posicionJ = Math.floor(Math.random()*MAX_CELDAS)
    }while(mapa[minotauro.posicionI][minotauro.posicionJ] == 0 || mapa[minotauro.posicionI][minotauro.posicionJ] == 3 || mapa[minotauro.posicionI][minotauro.posicionJ] == 4);
    mapa[minotauro.posicionI][minotauro.posicionJ] = 2;

    //IA
    function IA(){
        if(!tesoro.recogido){
            //Primero seteamos la direccion entre las cuatro posibles W A S o D
            mapa[minotauro.posicionI][minotauro.posicionJ] = 1;
            switch (Math.floor(Math.random()*5)) {
                case 1:
                    //W
                    minotauro.direccion = "w"
                    if(minotauro.posicionI-2>=0 && mapa[minotauro.posicionI-2][minotauro.posicionJ] == 1){
                        if(minotauro.posicionI-1>=0 && mapa[minotauro.posicionI-1][minotauro.posicionJ] == 1){
                            minotauro.posicionI  = minotauro.posicionI-2
                        }else if(minotauro.posicionI-1>=0 && mapa[minotauro.posicionI-1][minotauro.posicionJ] == 3){
                            jugador.muerto = true
                        }
                    }else if(minotauro.posicionI-2>=0 && mapa[minotauro.posicionI-2][minotauro.posicionJ] == 3){
                        jugador.muerto = true
                    }else if(minotauro.posicionI-1>=0 && mapa[minotauro.posicionI-1][minotauro.posicionJ] == 1){
                        minotauro.posicionI  = minotauro.posicionI-1
                    }
                break;
                case 2:
                    //A
                    minotauro.direccion = "a"
                    if(minotauro.posicionJ-2>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-2] == 1){
                        if(minotauro.posicionJ-1>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-1] == 1){
                            minotauro.posicionJ  = minotauro.posicionJ-2
                        }else if(minotauro.posicionJ-1>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-1] == 3){
                            jugador.muerto = true
                        }
                    }else if(minotauro.posicionJ-2>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-2] == 3){
                        jugador.muerto = true
                    }else if(minotauro.posicionJ-1>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-1] == 1){
                        minotauro.posicionJ  = minotauro.posicionJ-1
                    }
                break;
                case 3:
                    //D
                    minotauro.direccion = "d"
                    if(minotauro.posicionJ+2<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+2] == 1){
                        if(minotauro.posicionJ+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+1] == 1){
                            minotauro.posicionJ  = minotauro.posicionJ+2
                        }else if(minotauro.posicionJ+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+1] == 3){
                            jugador.muerto = true
                        }
                    }else if(minotauro.posicionJ+2<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+2] == 3){
                        jugador.muerto = true
                    }else if(minotauro.posicionJ+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+1] == 1){
                        minotauro.posicionJ  = minotauro.posicionJ+1
                    }
                break;
                case 4:
                    //S
                    minotauro.direccion = "s"
                    if(minotauro.posicionI+2<=MAX_CELDAS-1 && (mapa[minotauro.posicionI+2][minotauro.posicionJ] == 1)){
                        if(minotauro.posicionI+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI+1][minotauro.posicionJ] == 1){
                            minotauro.posicionI  = minotauro.posicionI+2
                        }else if(minotauro.posicionI+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI+1][minotauro.posicionJ] == 3){
                            jugador.muerto = true
                        }
                    }else if(minotauro.posicionI+2<=MAX_CELDAS-1 && mapa[minotauro.posicionI+2][minotauro.posicionJ] == 3){
                        jugador.muerto = true
                    }else if(minotauro.posicionI+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI+1][minotauro.posicionJ] == 1){
                        minotauro.posicionI  = minotauro.posicionI+1
                    }
                break;
            }
        }
        if(!jugador.muerto){
            console.log(minotauro.direccion);
            mapa[minotauro.posicionI][minotauro.posicionJ] = 2;            
            //mostrarMapa()
        }else{
            jugador.muerto = false
            clearInterval(IA)
            location.reload()
            alert("Has muerto, vuelve a intentarlo")
        }
    }

    mostrarMapa()

    setTimeout(()=>{
            setInterval(()=>{if(!control)IA()},500)
            setInterval(()=>{if(!control)generarMapa()},100)
            //Controles del Jugador
            addEventListener("keypress",(e)=>{
                if(!jugador.muerto && !tesoro.recogido){
                    if(e.key == "w"){
                        if(jugador.posicionI-1>=0 && mapa[jugador.posicionI-1][jugador.posicionJ] == 1){ // ARRIBA
                            mapa[jugador.posicionI-1][jugador.posicionJ] = 3;
                            mapa[jugador.posicionI][jugador.posicionJ] = 1;
                            //document.querySelector("#mapa").innerHTML = "";
                            jugador.posicionI = jugador.posicionI-1
                            jugador.direccion = "w"
                            //generarMapa()
                        }
                    }
                    else if(e.key == "s"){
                        if(jugador.posicionI+1<=MAX_CELDAS-1 && mapa[jugador.posicionI+1][jugador.posicionJ] == 1){ //ABAJO
                            mapa[jugador.posicionI+1][jugador.posicionJ] = 3;
                            mapa[jugador.posicionI][jugador.posicionJ] = 1;
                            //document.querySelector("#mapa").innerHTML = "";
                            jugador.posicionI = jugador.posicionI+1
                            jugador.direccion = "s"
                            //generarMapa()
                        }
                    }
                    else if(e.key == "d"){
                        if(jugador.posicionJ+1<=MAX_CELDAS-1 && mapa[jugador.posicionI][jugador.posicionJ+1] == 1){ //DERECHA
                            mapa[jugador.posicionI][jugador.posicionJ+1] = 3;
                            mapa[jugador.posicionI][jugador.posicionJ] = 1;
                            //document.querySelector("#mapa").innerHTML = "";
                            jugador.posicionJ = jugador.posicionJ+1
                            jugador.direccion = "d"
                            //generarMapa()
                        }
                    }
                    else if(e.key == "a"){
                        if(jugador.posicionJ-1>=0 && mapa[jugador.posicionI][jugador.posicionJ-1] == 1){ //IZQUIERDA
                            mapa[jugador.posicionI][jugador.posicionJ-1] = 3;
                            mapa[jugador.posicionI][jugador.posicionJ] = 1;
                            //document.querySelector("#mapa").innerHTML = "";
                            jugador.posicionJ = jugador.posicionJ-1
                            jugador.direccion = "a"
                            //generarMapa()
                        }
                    }
                }
            })
    },1000)
    
    function generarMapa(){
        if(tesoro.recogido){            
            if(!control){
                control = true
                alert("¡¡¡Felicidades has conseguido el tesoro, has ganado al minotauro!!!!")
            }
        }
        let tabla = "<table style='border:1px solid white'>";
        for(let i = 0; i<MAX_CELDAS;i++){
            tabla += "<tbody><tr>";
            for(let j = 0;j<MAX_CELDAS;j++){
                if(mapa[i][j] == 3){
                    tabla += "<td class='jugador'></td>"
                }else if(i+1<=MAX_CELDAS-1 && mapa[i+1][j] == 3 && mapa[i][j] != 0){    //Comprobamos encima del jugador
                    if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                        tesoro.recogido = true;
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                      
                }else if(i-1>=0 && mapa[i-1][j] == 3 && mapa[i][j] != 0){ //Comprobamos debajo del jugador
                    if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                        tesoro.recogido = true;
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                       
                }else if(j-1>=0 && mapa[i][j-1] == 3 && mapa[i][j] != 0){ //Comprobamos derecha del jugador
                    if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                        tesoro.recogido = true;
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                         
                }else if(j+1<=MAX_CELDAS-1 && mapa[i][j+1] == 3 && mapa[i][j] != 0){//Comprobamos izquierda del jugador
                    if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                        tesoro.recogido = true;
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                       
                }else if(i+1<=MAX_CELDAS-1 && j+1<=MAX_CELDAS-1 && mapa[i+1][j+1] == 3 && mapa[i][j] != 0){ //Izquierda-Arriba del jugador
                        if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                          
                }else if(i-1>=0 && j+1<=MAX_CELDAS-1 && mapa[i-1][j+1] == 3 && mapa[i][j] != 0){ // Izquierda-Abajo
                        if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                       
                }else if(i-1>=0 && j-1>=0 && mapa[i-1][j-1] == 3 && mapa[i][j] != 0){//Derecha-Abajo
                    if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }                     
                }else if(i+1<=MAX_CELDAS-1 && j-1>=0 && mapa[i+1][j-1] == 3 && mapa[i][j] != 0){ //Derecha-Arriba
                    if(mapa[i][j] == 4){
                        tabla += "<td class='tesoro'></td>"
                    }else if(mapa[i][j] == 2){
                        tabla += "<td class='enemigo'></td>"
                    }else{
                        tabla += "<td class='encendido'></td>"
                    }
                }else /* if(mapa[i][j] == 0 || mapa[i][j] == 1) */{
                    tabla += "<td class='apagado'></td>"
                }/*  else if(mapa[i][j] == 1){
                    tabla += "<td class='encendido'></td>"
                }else if(mapa[i][j] == 2){
                    tabla += "<td class='enemigo'></td>"
                }  else if(mapa[i][j] == 4){
                    tabla += "<td class='tesoro'></td>"
                } */
            }
            tabla += "</tr></tbody>"
            
           
            
        } tabla += "</table>"
        mapaDibujo.innerHTML = tabla;
    }
    function mostrarMapa(){
        document.querySelector("#mapa").innerHTML = ""
        let tabla = "<table style='border:1px solid white'>";
        for(let i = 0; i<MAX_CELDAS;i++){
            tabla += "<tr>";
            for(let j = 0;j<MAX_CELDAS;j++){
                if(mapa[i][j] == 3){
                    tabla += "<td class='jugador'></td>"
                }else if(mapa[i][j] == 0){
                    tabla += "<td class='apagado'></td>"
                }else if(mapa[i][j] == 1){
                    tabla += "<td class='encendido'></td>"
                }else if(mapa[i][j] == 2){
                    tabla += "<td class='enemigo'></td>"
                }  else if(mapa[i][j] == 4){
                    tabla += "<td class='tesoro'></td>"
                }
            }
            tabla += "</tr>"
        }
        tabla += "</table>"
        document.querySelector("#mapa").innerHTML = tabla;
    }
    document.querySelector("#recarga").addEventListener("click",()=>{location.reload()})
})