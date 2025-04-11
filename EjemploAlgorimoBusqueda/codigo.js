const MAX_CELDAS = 30;
let matriz = [];

 //Primer procesado del mapa - Generador puntos origen
 for(let i = 0; i<MAX_CELDAS;i++){
  matriz.push([]);
  for(let j = 0;j<MAX_CELDAS;j++){
      if(Math.floor(Math.random()*3) == 1){
          matriz[i].push(1)
      }else{
          matriz[i].push(0)
      }
  }
}
//Segundo procesado del mapa - Horizontal|Vertical
for(let i = 0; i<MAX_CELDAS;i++){
  for(let j = 0;j<MAX_CELDAS;j++){
      contador = 0;
      if(matriz[i][j] == 0){
          if(i<MAX_CELDAS-1 && matriz[i+1][j] == 0){ //Derecha
              contador++;
          }
          if(i>0 && matriz[i-1][j] == 0){//Izquierda
              contador++;
          }
          if(j<MAX_CELDAS-1 && matriz[i][j+1] == 0){//Abajo
              contador++;
          }
          if(j>0 && matriz[i][j-1] == 0){//Arriba
              contador++;
          }
      }
      if(contador == 2){
          matriz[i][j] = 0;
      }
  }
}
//Tercer procesado del mapa - Diagonales
for(let i = 0; i<MAX_CELDAS;i++){
  for(let j = 0;j<MAX_CELDAS;j++){
      contador = 0;
      if(matriz[i][j] == 0){
          if(i+1<=MAX_CELDAS-1 && j+1<=MAX_CELDAS-1 && matriz[i+1][j+1] == 0){ //Derecha-Abajo
              contador++;
          }
          if(i-1>=0 && j+1<=MAX_CELDAS-1 && matriz[i-1][j+1] == 0){ // Izquierda-Abajo
              contador++;
          }
          if(i-1>=0 && j+1<=MAX_CELDAS-1 && matriz[i-1][j+1] == 0){//Derecha-Arriba
              contador++;
          }
          if(i-1>=0 && j-1>=0 && matriz[i-1][j-1] == 0){//Izquierda-Arriba
              contador++;
          }
      }
      if(contador == 2){
          matriz[i][j] = 0;
      }
  }
}
function mostrarMapa(matriz){
  document.querySelector("#mapa").innerHTML = ""
  let tabla = "<table style='border:1px solid white'>";
  for(let i = 0; i<matriz.length;i++){
      tabla += "<tr>";
      for(let j = 0;j<matriz[i].length;j++){
          if(matriz[i][j] == 3){
              tabla += "<td class='jugador'></td>"
          }else if(matriz[i][j] == 1){
              tabla += "<td class='apagado'></td>"
          }else if(matriz[i][j] == 0){
              tabla += "<td class='encendido'></td>"
          }else if(matriz[i][j] == 2){
              tabla += "<td class='enemigo'></td>"
          }  else if(matriz[i][j] == 4){
              tabla += "<td class='tesoro'></td>"
          }
      }
      tabla += "</tr>"
  }
  tabla += "</table>"
  document.querySelector("#mapa").innerHTML = tabla;
}

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
      matriz[filaActual][columnaActual]  =  3;
      mostrarMapa(matriz)
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
          filaNueva >= 0 &&
          filaNueva < filas &&
          columnaNueva >= 0 &&
          columnaNueva < columnas &&
          matriz[filaNueva][columnaNueva] !== 1
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
          filaNueva >= 0 &&
          filaNueva < filas &&
          columnaNueva >= 0 &&
          columnaNueva < columnas &&
          distancias[filaNueva][columnaNueva] < distanciaMinima
        ) {
          posicionAnterior = [filaNueva, columnaNueva];
          matriz[filaNueva][columnaNueva] = 3
          distanciaMinima = distancias[filaNueva][columnaNueva];
        }
      }
  
      // Agrega la posición anterior al camino
      camino.unshift(posicionAnterior);
      filaActual = posicionAnterior[0];
      columnaActual = posicionAnterior[1];
    }
  
    // Devuelve el camino encontrado
    for(let i of camino){
      matriz[i[0]][i[1]] = 4;
      mostrarMapa(matriz)
    }
    return camino;
  }
  

  // Ejemplo de uso
  /* const matriz = [
    [0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]; */
  
  const inicio = { fila: 0, columna: 0 };
  const fin = { fila: 15, columna: 15 };
  
  const camino = encontrarCaminoOptimo(matriz, inicio, fin);
  if(camino == null){
    location.reload()
  }
  if (camino) {
    console.log("Camino encontrado:", camino);
  } else {
    console.log("No se encontró un camino.");
  }

mostrarMapa(matriz)
  