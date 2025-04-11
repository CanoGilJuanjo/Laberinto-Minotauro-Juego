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
    var control = false; //Control para parar la logica del juego

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
    /* function IA(){
        if(!tesoro.recogido){
            //Primero seteamos la direccion entre las cuatro posibles W A S o D
            mapa[minotauro.posicionI][minotauro.posicionJ] = 1;
            var random = Math.floor((Math.random()*4)+1)
            console.log(random);
            var contador = 0;
            do{
                switch (random) {
                    case 1:
                        random = 0
                        //W
                        minotauro.direccion = "arriba"
                        if(minotauro.posicionI-2>=0 && mapa[minotauro.posicionI-2][minotauro.posicionJ] == 1){
                            if(mapa[minotauro.posicionI-1][minotauro.posicionJ] == 1){
                                minotauro.posicionI  = minotauro.posicionI-2
                            }else if(mapa[minotauro.posicionI-1][minotauro.posicionJ] == 3){
                                jugador.muerto = true
                            }
                        }else if(minotauro.posicionI-2>=0 && mapa[minotauro.posicionI-2][minotauro.posicionJ] == 3){
                            jugador.muerto = true
                        }else if(minotauro.posicionI-1>=0 && mapa[minotauro.posicionI-1][minotauro.posicionJ] == 1){
                            minotauro.posicionI  = minotauro.posicionI-1
                        }else if(minotauro.posicionI-1>=0 && mapa[minotauro.posicionI-1][minotauro.posicionJ] == 3){
                            jugador.muerto = true
                        }else {
                            random = Math.floor((Math.random()*4)+1)
                        }
                    break;
                    case 2:
                        random = 0
                        //A
                        minotauro.direccion = "izquierda"
                        if(minotauro.posicionJ-2>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-2] == 1){
                            if(mapa[minotauro.posicionI][minotauro.posicionJ-1] == 1){
                                minotauro.posicionJ  = minotauro.posicionJ-2
                            }else if(mapa[minotauro.posicionI][minotauro.posicionJ-1] == 3){
                                jugador.muerto = true
                            }
                        }else if(minotauro.posicionJ-2>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-2] == 3){
                            jugador.muerto = true
                        }else if(minotauro.posicionJ-1>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-1] == 1){
                            minotauro.posicionJ  = minotauro.posicionJ-1
                        }else if(minotauro.posicionJ-1>=0 && mapa[minotauro.posicionI][minotauro.posicionJ-1] == 3){
                            jugador.muerto = true
                        }else {
                            random = Math.floor((Math.random()*4)+1)
                        }
                    break;
                    case 3:
                        random = 0
                        //D
                        minotauro.direccion = "derecha"
                        if(minotauro.posicionJ+2<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+2] == 1){
                            if(mapa[minotauro.posicionI][minotauro.posicionJ+1] == 1){
                                minotauro.posicionJ  = minotauro.posicionJ+2
                            }else if(mapa[minotauro.posicionI][minotauro.posicionJ+1] == 3){
                                jugador.muerto = true
                            }
                        }else if(minotauro.posicionJ+2<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+2] == 3){
                            jugador.muerto = true
                        }else if(minotauro.posicionJ+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+1] == 1){
                            minotauro.posicionJ  = minotauro.posicionJ+1
                        }else if(minotauro.posicionJ+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI][minotauro.posicionJ+1] == 3){
                            jugador.muerto = true
                        }else {
                            random = Math.floor((Math.random()*4)+1)
                        }
                    break;
                    case 4:
                        random = 0
                        //S
                        minotauro.direccion = "abajo"
                        if(minotauro.posicionI+2<=MAX_CELDAS-1 && (mapa[minotauro.posicionI+2][minotauro.posicionJ] == 1)){
                            if(mapa[minotauro.posicionI+1][minotauro.posicionJ] == 1){
                                minotauro.posicionI  = minotauro.posicionI+2
                            }else if(mapa[minotauro.posicionI+1][minotauro.posicionJ] == 3){
                                jugador.muerto = true
                            }
                        }else if(minotauro.posicionI+2<=MAX_CELDAS-1 && mapa[minotauro.posicionI+2][minotauro.posicionJ] == 3){
                            jugador.muerto = true
                        }else if(minotauro.posicionI+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI+1][minotauro.posicionJ] == 1){
                            minotauro.posicionI  = minotauro.posicionI+1
                        }else if(minotauro.posicionI+1<=MAX_CELDAS-1 && mapa[minotauro.posicionI+1][minotauro.posicionJ] == 3){
                            jugador.muerto = true
                        }else{
                            random = Math.floor((Math.random()*4)+1)
                        }
                    break;
                }
                contador++
            }while(random != 0 && contador < 50);
        }
        mapa[minotauro.posicionI][minotauro.posicionJ] = 2;
        if(jugador.muerto){
            control = true
            alert("Has muerto, vuelve a intentarlo")
        }
    } */
    mostrarMapa()


    let inicio = { fila: minotauro.posicionI, columna: minotauro.posicionJ };
    let fin = { fila: tesoro.posicionI, columna: tesoro.posicionJ };
    let camino = encontrarCaminoOptimo(mapa, inicio, fin);
    if(camino == null){
        location.reload()
    }

    inicio = { fila: minotauro.posicionI, columna: minotauro.posicionJ };
    fin = { fila: jugador.posicionI, columna: jugador.posicionJ };
    camino = encontrarCaminoOptimo(mapa, inicio, fin);
    if(camino == null){
        location.reload()
    }


    let pos = 0;
    setTimeout(()=>{
            setInterval(()=>{if(!control){generarMapa() }else{mostrarMapa()}},150)
            setInterval(()=>{if(!control)
                /* IA() */  
                if(!control){
                    mapa[minotauro.posicionI][minotauro.posicionJ] = 1;
                    minotauro.posicionI = camino[pos][0]
                    minotauro.posicionJ = camino[pos][1]
                    mapa[minotauro.posicionI][minotauro.posicionJ] = 2;
                    inicio = { fila: minotauro.posicionI, columna: minotauro.posicionJ };
                    fin = { fila: jugador.posicionI, columna: jugador.posicionJ };
                    if(pos >= camino.length-1){
                        pos = 0;
                        camino = encontrarCaminoOptimo(mapa, inicio, fin);
                    }
                    if(minotauro.posicionI == jugador.posicionI && minotauro.posicionJ == jugador.posicionJ){
                        jugador.muerto = true
                        control = true
                        alert("Has muerto, vuelve a intentarlo")
                    }
                    if(pos+1 == camino.length-1){
                        pos++
                    }else{
                        pos+=2;
                    }
                }
            },500)
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
    },500)
    
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

    function encontrarCaminoOptimo(matriz, inicio, fin) {
        // Dimensiones de la matriz
        const filas = matriz.length;
        const columnas = matriz[0].length;
      
        // Crea una matriz para almacenar las distancias desde el punto de inicio
        const distancias = new Array(filas).fill(null).map(() => new Array(columnas).fill(Infinity));
        distancias[inicio.fila][inicio.columna] = 0;
      
        // Crea una cola para realizar la búsqueda en anchura
        const cola = [[inicio.fila, inicio.columna]];
      
        // Direcciones posibles para moverse en la matriz
        const direcciones = [
          [-1, 0], // Arriba
          [1, 0], // Abajo
          [0, -1], // Izquierda
          [0, 1], // Derecha
        ];
      
        // Mientras la cola no esté vacía
        while (cola.length > 0) {
          const [filaActual, columnaActual] = cola.shift();
      
          // Si se ha encontrado el punto final, se termina la búsqueda
          if (filaActual === fin.fila && columnaActual === fin.columna) {
            break;
          }
      
          // Recorre las direcciones posibles
          for (const [filaDesplazamiento, columnaDesplazamiento] of direcciones) {
            const filaNueva = filaActual + filaDesplazamiento;
            const columnaNueva = columnaActual + columnaDesplazamiento;
      
            // Verifica si la nueva posición es válida y no es un obstáculo
            if (
              filaNueva >= 1 &&
              filaNueva < filas &&
              columnaNueva >= 1 &&
              columnaNueva < columnas &&
              matriz[filaNueva][columnaNueva] !== 0
            ) {
              // Calcula la distancia a la nueva posición
              const distanciaNueva = distancias[filaActual][columnaActual] + 1;
      
              // Si la distancia a la nueva posición es menor que la distancia actual
              if (distanciaNueva < distancias[filaNueva][columnaNueva]) {
                // Actualiza la distancia y agrega la nueva posición a la cola
                distancias[filaNueva][columnaNueva] = distanciaNueva;
                cola.push([filaNueva, columnaNueva]);
              }
            }
          }
        }
        
        // Si no se encontró el punto final, devuelve null
        if (distancias[fin.fila][fin.columna] === Infinity) {
          return null;
        }
      
        // Reconstruye el camino desde el punto final hasta el punto de inicio
        let camino = [[fin.fila, fin.columna]];
        let filaActual = fin.fila;
        let columnaActual = fin.columna;
      
        while (filaActual !== inicio.fila || columnaActual !== inicio.columna) {
          // Encuentra la posición anterior con la menor distancia
          let posicionAnterior = null;
          let distanciaMinima = Infinity;
          for (const [filaDesplazamiento, columnaDesplazamiento] of direcciones) {
            const filaNueva = filaActual + filaDesplazamiento;
            const columnaNueva = columnaActual + columnaDesplazamiento;
      
            if (
              filaNueva >= 1 &&
              filaNueva < filas &&
              columnaNueva >= 1 &&
              columnaNueva < columnas &&
              distancias[filaNueva][columnaNueva] < distanciaMinima
            ) {
              posicionAnterior = [filaNueva, columnaNueva];
              distanciaMinima = distancias[filaNueva][columnaNueva];
            }
          }
      
          // Agrega la posición anterior al camino
          camino.unshift(posicionAnterior);
          filaActual = posicionAnterior[0];
          columnaActual = posicionAnterior[1];
        }
      
        // Devuelve el camino encontrado
        return camino;
    }
})