const http = require('http');
const fs = require('fs');
const url = require('url');

const PUERTO = 9090;

const mime_type = {
  "html" : "text/html",
  "css"  : "text/css",
  "js"   : "application/javascript",
  "jpg"  : "image/jpg",
  "gif"  : "image/gif",
  "ico"  : "image/x-icon",
  "json" : "application/json",
};

//-- Cargar la pagina principal de la web
const MAIN = fs.readFileSync('main.html', 'utf-8');

//-- Cargar pagina de error
const FAIL = fs.readFileSync('fail.html', 'utf-8');

//-- Cargar las paginas de los productos
const PRODUCTO1 = fs.readFileSync('producto1.html', 'utf-8');
const PRODUCTO2 = fs.readFileSync('producto2.html', 'utf-8');
const PRODUCTO3 = fs.readFileSync('producto3.html', 'utf-8');
const PRODUCTO4 = fs.readFileSync('producto4.html', 'utf-8');

//-- Cargar la pagina del Carrito
const CARRITO = fs.readFileSync('carrito.html','utf-8');

//-- Variable para saber si hay articulos en el carrito
let productos_carrito = false;

//-- Variable para la búsqueda con autocompletado
let busqueda;

//-- Cargar pagina web del formulario login
const LOGIN = fs.readFileSync('login.html','utf-8');
const SEND = fs.readFileSync('send.html','utf-8');

//-- Cargar las paginas de respuesta
const LOGIN_OK = fs.readFileSync('login_ok.html','utf-8');
const LOGIN_NO = fs.readFileSync('login_no.html','utf-8');
const SEND_OK = fs.readFileSync('pedido_ok.html','utf-8');
const ADD_OK = fs.readFileSync('add_ok.html','utf-8');

//-- Registro -> Fichero JSON
const FICHERO_JSON = "tienda.json";
const FICHERO_JSON_PRUEBA = "tienda_prueba.json";

//-- Leer el fichero JSON (lectura sincrona)
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Crear una lista de usuarios registrados.
let users_reg = [];
console.log("Lista de usuarios registrados");
console.log("-----------------------------");
tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.user);
    users_reg.push(element.user);
  });
console.log();

//-- Crear una lista de productos disponibles.
let productos_disp = [];
let product_list = [];
console.log("Lista de productos disponibles");
console.log("-----------------------------");
tienda[0]["productos"].forEach((element, index)=>{
  console.log("Producto " + (index + 1) + ": " + element.nombre +
              ", Stock: " + element.stock + ", Precio: " + element.precio);
  productos_disp.push([element.nombre, element.descripcion, element.stock, 
                       element.precio]);
  product_list.push(element.nombre);
});
console.log();

//-- Analizar la cookie y devolver el nombre de usuario si existe,
//-- null en caso contrario.
function name_user(req) {
  
  //-- Leer la cookie recibida
  const cookie = req.headers.cookie;

  //-- Si hay cookie, guardamos el usuario
  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombres y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario solo si nombre = user
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });

    //-- si user no esta asignada se devuelve null
    return user || null;
  }
}

//-- Funcion para crear las cookies al añadir articulos al carrito.
function add_al_carrito(req, res, producto) {
  const cookie = req.headers.cookie;

  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Si nombre = carrito enviamos cookie de respuesta
      if (nombre.trim() === 'carrito') {
        res.setHeader('Set-Cookie', element + ':' + producto);
      }
    });
  }
}

//-- Obtener el carrito
function get_carrito(req){
  //-- Leer la cookie recibida
  const cookie = req.headers.cookie;

  if (cookie){
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Variables para guardar los datos del carrito
    let carrito;
    let personaje_omen = '';
    let num_personaje_omen = 0;
    let personaje_killjoy = '';
    let num_personaje_killjoy = 0;
    let personaje_cypher = '';
    let num_personaje_cypher = 0;
    let personaje_reyna = '';
    let num_personaje_reyna = 0;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Si nombre = carrito registramos los articulos
      if (nombre.trim() === 'carrito') {
        productos = valor.split(':');
        productos.forEach((producto) => {
          if (producto == 'personaje_omen'){
            if (num_personaje_omen == 0) {
              personaje_omen = productos_disp[0][0];
            }
            num_personaje_omen += 1;
          }else if (producto == 'personaje_killjoy'){
            if (num_personaje_killjoy == 0){
              personaje_killjoy = productos_disp[1][0];
            }
            num_personaje_killjoy += 1;
          }else if (producto == 'personaje_cypher'){
            if (num_personaje_cypher == 0){
              personaje_cypher = productos_disp[2][0];
            }
            num_personaje_cypher += 1;
          }else if (producto == 'personaje_reyna'){
            if (num_personaje_reyna == 0){
              personaje_reyna = productos_disp[3][0];
            }
            num_personaje_reyna += 1;
          }
        });

        if (num_personaje_omen != 0) {
          personaje_omen += ' x ' + num_personaje_omen;
        }
        if (num_personaje_killjoy != 0) {
          personaje_killjoy += ' x ' + num_personaje_killjoy;
        }
        if (num_personaje_cypher != 0) {
          personaje_cypher += ' x ' + num_personaje_cypher;
        }
        if (num_personaje_reyna != 0) {
          personaje_reyna += ' x ' + num_personaje_reyna;
        }
        carrito = personaje_omen + '<br>' + personaje_killjoy + '<br>' + personaje_cypher + '<br>' + personaje_reyna;
      }
    });

    //-- Si esta vacío se devuelve null
    return carrito || null;
  }
}

var n;
//-- Funcion para obtener la pagina del producto
function get_producto(n, content) {
  content = content.replace('NOMBRE', productos_disp[n][0]);
  content = content.replace('DESCRIPCION', productos_disp[n][1]);
  content = content.replace('PRECIO', productos_disp[n][3]);

  return content;
}

//-- Crear el SERVIDOR.
const server = http.createServer((req, res) => {

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  
    console.log("");
    console.log("Método: " + req.method);
    console.log("Recurso: " + req.url);
    console.log("  Ruta: " + myURL.pathname);
    console.log("  Parametros: " + myURL.searchParams);

    //-- Variables para el mensaje de respuesta
    let content_type = mime_type["html"];
    let content = "";

    //-- Leer recurso y eliminar la / inicial
    let recurso = myURL.pathname;
    recurso = recurso.substr(1); 

    switch (recurso) {
      case '':
          console.log("Main page");
          //-- Por defecto -> pagina de inicio
          content = MAIN;

           //-- Obtener el usuario que ha accedido
          let user = name_user(req);

          //-- Si la variable user está asignada
          //-- no mostrar el acceso a login.
          if (user) {
            //-- Anadir a la página el nombre del usuario
            content = MAIN.replace("HTML_EXTRA", "<h2>Usuario: " + user + "</h2>" +
                      `<form action="/carrito" method="get"><input type="submit" value="Carrito"/></form>`);
          }else{
            //-- Mostrar el enlace al formulario Login
            content = MAIN.replace("HTML_EXTRA", 
                      `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
          }
          break;
      //-- Paginas de los distintos productos.
      case 'producto1':
        n = 0;
        content = PRODUCTO1;
        content = get_producto(n, content);
        break;
      
      case 'producto2': 
        n = 1;
        content = PRODUCTO2;
        content = get_producto(n, content);
        break;

      case 'producto3':
        n = 2;
        content = PRODUCTO3;
        content = get_producto(n, content);
        break;

      case 'producto4': 
        n = 3;
        content = PRODUCTO4;
        content = get_producto(n, content);
        break;

      //-- Añadir al carrito los distintos productos
      case 'add_personaje_omen':
        content = ADD_OK;
        if (productos_carrito) {
          add_al_carrito(req, res, 'personaje_omen');
        }else{
          res.setHeader('Set-Cookie', 'carrito=personaje_omen');
          productos_carrito = true;
        }
        //-- Si se esta registrado se muestra el acceso al carrito,
        //-- sino se muestra el acceso al login.
        user_registered = name_user(req);
          if (user_registered) {
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
          }else{
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
          }
        break;

      case 'add_personaje_killjoy':
        content = ADD_OK;
        if (productos_carrito) {
          add_al_carrito(req, res, 'personaje_killjoy');
        }else{
          res.setHeader('Set-Cookie', 'carrito=personaje_killjoy');
          productos_carrito = true;
        }
        //-- Si se esta registrado se muestra el acceso al carrito,
        //-- sino se muestra el acceso al login.
        user_registered = name_user(req);
          if (user_registered) {
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
          }else{
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
          }
        break;
      
      case 'add_personaje_cypher':
        content = ADD_OK;
        if (productos_carrito) {
          add_al_carrito(req, res, 'personaje_cypher');
        }else{
          res.setHeader('Set-Cookie', 'carrito=personaje_cypher');
          productos_carrito = true;
        }
        //-- Si se esta registrado se muestra el acceso al carrito,
        //-- sino se muestra el acceso al login.
        user_registered = name_user(req);
          if (user_registered) {
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
          }else{
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
          }
        break;

      case 'add_personaje_reyna':
        content = ADD_OK;
        if (productos_carrito) {
          add_al_carrito(req, res, 'personaje_reyna');
        }else{
          res.setHeader('Set-Cookie', 'carrito=personaje_reyna');
          productos_carrito = true;
        }
        //-- Si se esta registrado se muestra el acceso al carrito,
        //-- sino se muestra el acceso al login.
        user_registered = name_user(req);
          if (user_registered) {
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
          }else{
            //-- Mostrar el enlace al formulario Login
            content = ADD_OK.replace("HTML_EXTRA", 
                      `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
          }
        break;
      
      case 'carrito':
        content = CARRITO;
        let carrito = get_carrito(req);
        content = content.replace("PRODUCTOS", carrito);
        break;
      
      //-- Acceso al formulario Login
      case 'login':
        content = LOGIN;
        break;
      
      //-- Procesar la respuesta del formulario login
      case 'procesarlogin':
        //-- Obtener el nombre de usuario
        let usuario = myURL.searchParams.get('nombre');
        console.log('Nombre: ' + usuario);
        //-- Dar bienvenida solo a usuarios registrados.
        if (users_reg.includes(usuario)){
            console.log('El usuario esta registrado');
            //-- Asignar la cookie al usuario registrado.
            res.setHeader('Set-Cookie', "user=" + usuario);
            //-- Asignar la página web de login ok.
            content = LOGIN_OK;
            html_extra = usuario;
            content = content.replace("HTML_EXTRA", html_extra);
        }else{
            content = LOGIN_NO;
        }
        break;
      
      //-- Acceso al formulario de pedidos
      case 'pedido':
        content = SEND;
        let pedido = get_carrito(req);
        content = content.replace("PRODUCTOS", pedido);
        break;
      
      //-- Procesar el formulario de pedidos
      case 'procesarpedido':
        //-- Guardar los datos del pedido en el fichero JSON
        //-- Primero obtenemos los parametros
        let direccion = myURL.searchParams.get('dirección');
        let tarjeta = myURL.searchParams.get('tarjeta');
        console.log("Dirección de envío: " + direccion + "\n" +
                    "Número de la tarjeta: " + tarjeta + "\n");
        //-- Obtener la lista de productos y la cantidad
        carro = get_carrito(req);
        producto_unidades = carro.split('<br>');
        console.log(producto_unidades);

        //-- Arrays para guardar los productos adquiridos
        let list_productos = [];
        let list_unidades = [];
        //-- Obtener numero de productos adquiridos y actualizar stock
        producto_unidades.forEach((element, index) => {
          let [producto, unidades] = element.split(' x ');
          list_productos.push(producto);
          list_unidades.push(unidades);
        });
        
        //-- Actualizar en la base de datos el stock de los productos.
        tienda[0]["productos"].forEach((element, index)=>{
          console.log("Producto " + (index + 1) + ": " + element.nombre);
          console.log(list_productos[index]);
          console.log();
          if (element.nombre == list_productos[index]){
            element.stock = element.stock - list_unidades[index];
          }
        });
        console.log();
        
        //-- Guardar datos del pedido en el registro tienda.json
        //-- si este no es nulo (null)
        if ((direccion != null) && (tarjeta != null)) {
          let pedido = {
            "user": name_user(req),
            "dirección": direccion,
            "tarjeta": tarjeta,
            "productos": producto_unidades
          }
          tienda[2]["pedidos"].push(pedido);
          //-- Convertir a JSON y registrarlo
          let myTienda = JSON.stringify(tienda, null, 4);
          fs.writeFileSync(FICHERO_JSON_PRUEBA, myTienda);
        }
        //-- Confirmar pedido
        console.log('Pedido procesado correctamente');
        content = SEND_OK;
        break;
      
      //-- Barra de búsqueda
      case 'productos':
          console.log("Peticion de Productos!")
          content_type = mime_type["json"]; 

          //-- Leer los parámetros
          let param1 = myURL.searchParams.get('param1');

          param1 = param1.toUpperCase();

          console.log("  Param: " +  param1);

          let result = [];

          for (let prod of product_list) {

              //-- Pasar a mayúsculas
              prodU = prod.toUpperCase();

              //-- Si el producto comienza por lo indicado en el parametro
              //-- meter este producto en el array de resultados
              if (prodU.startsWith(param1)) {
                  result.push(prod);
              }
              
          }
          console.log(result);
          busqueda = result;
          content = JSON.stringify(result);
          break;
        
      case 'buscar':
        if (busqueda == 'Omen el fantasma') {
          n = 0;
          content = PRODUCTO1;
          content = get_producto(n, content);
        }else if(busqueda == 'Killjoy la agente alemana'){
          n = 1;
          content = PRODUCTO2;
          content = get_producto(n, content);
        }else if(busqueda == 'Cypher el agente marroqui'){
          n = 2;
          content = PRODUCTO3;
          content = get_producto(n, content);
        }else if(busqueda == 'Reyna la agente mexicana'){
          n = 3;
          content = PRODUCTO4;
          content = get_producto(n, content);
        }else{
          content = FAIL;
        }
        break;
    
      case 'cliente.js':
          //-- Leer fichero javascript
          console.log("recurso: " + recurso);
          fs.readFile(recurso, 'utf-8', (err,data) => {
              if (err) {
                  console.log("Error: " + err)
                  return;
              } else {
                res.setHeader('Content-Type', mime_type["js"]);
                res.write(data);
                res.end();
              }
          });
          
          return;
          break;

          //-- Si no es ninguna de las anteriores devolver mensaje de error
      default:
          res.setHeader('Content-Type', mime_type["html"]);
          res.statusCode = 404;
          res.write(FAIL);
          res.end();
          return;
  }

    //-- Si hay datos en el cuerpo, se imprimen
    req.on('data', (cuerpo) => {

      //-- Los datos del cuerpo son caracteres
      req.setEncoding('utf8');
      console.log(`Cuerpo (${cuerpo.length} bytes)`)
      console.log(` ${cuerpo}`);
    });

    //-- Esto solo se ejecuta cuando llega el final del mensaje de solicitud
    req.on('end', ()=> {
      //-- Generar respuesta
      res.setHeader('Content-Type', content_type);
      res.write(content);
      res.end()
    });

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);