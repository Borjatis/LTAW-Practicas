//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON (lectura sincrona)
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Imprimir contenido de la tienda
console.log("Contenido de la tienda");
console.log("----------------------");
console.log(tienda);

//-- Imprimir el numero de usuarios registrados
console.log("Hay " + tienda[1]["usuarios"].length + " usuarios registrados.");

//-- Imprimir lista de usuarios registrados.
console.log("Lista de usuarios registrados");
console.log("-----------------------------");
tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.user);
  });
console.log();

//-- Imprimir numero de productos de la tienda.
console.log("Hay " + tienda[0]["productos"].length + " productos en la tienda.");

//-- Imprimir lista de productos.
console.log("Lista de productos");
console.log("-----------------------------");
tienda[0]["productos"].forEach((element, index)=>{
    console.log("Producto " + (index + 1) + ": " + element.nombre);
  });
console.log();

//-- Imprimir numero de pedidos
console.log("Hay " + tienda[2]["pedidos"].length + " pedidos en la tienda.");

//-- Imprimir lista de pedidos.
console.log("Lista de pedidos");
console.log("-----------------------------");
tienda[2]["pedidos"].forEach((element, index)=>{
    console.log("Detalles del Pedido " + (index + 1) + "\n" +
                "Usuario: " + element.user + "\n" +
                "Dirección de envío: " + element.dirección + "\n" +
                "Número de la tarjeta: " + element.tarjeta);
                element.productos.forEach((element, index) => {
                    console.log("Producto " + (index + 1) + ": " + element.producto)
                });
  });
console.log();