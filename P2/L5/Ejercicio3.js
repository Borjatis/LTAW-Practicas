//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Nombre del fichero JSON de salida.
const FICHERO_JSON_OUT = "tienda-modificada.json"

//-- Leer el fichero JSON (lectura sincrona)
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Obtener el stock de cada producto e incrementarlo una unidad
tienda[0]["productos"].forEach((element, index)=>{
    console.log("Stock Producto " + (index + 1) + ": " + element.stock);
    element.stock += 1;
  });
console.log();

//-- Guardar la información modificada en el nuevo fichero json
//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);
console.log();