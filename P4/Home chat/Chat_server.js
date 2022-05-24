//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');
const ip = require('ip');
//-- Cargar el módulo de electron
const electron = require('electron');
//-- Info del sistema
const process = require('process');

const PUERTO = 9090;

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

let users = 0;
const welcome = 'Un nuevo puto amo se ha unido al Super Chat';
const goodbye = 'Un no tan puto amo se ha ido del Super Chat';

//-- Variable para distinguir si un usuario está escribiendo
const writing = 'Un usuario está escribiendo...';

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    chat = fs.readFileSync('./client/Chat_client.html', 'utf-8');
    res.send(chat);
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('client'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);
  users += 1;
  socket.send('¡Heeeeeey pero que pasa chaval! Bienvenido');
  socket.broadcast.emit('message', welcome);
  //-- Enviar al render
  win.webContents.send('print-users', users);

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    socket.broadcast.emit('message', goodbye);
    users -= 1;
    //-- Enviar al render
    win.webContents.send('print-users', users);
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    //-- Enviar al render
    win.webContents.send('print-msg', msg);

    if (msg.startsWith("/")) {
        if (msg == '/help') {
            msg = "Lista de comandos: <br>" + 
               "<b>/help</b>" + " : Muestra la lista de comandos<br>" + 
               "<b>/list</b>" + " : Muestra el número de usuarios en el chat<br>" + 
               "<b>/hello</b>" + " : El servidor te saluda<br>" + 
               "<b>/date</b>" + " : Muestra la fecha actual<br>" + 
               "<b>/music</b>" + " : Pone música de fondo<br>" 
            console.log("SE ENVIA LISTA DE COMANDOS".green);
            socket.send(msg);
        } else if (msg == "/list") {
            socket.send("Número de usuarios en el Super chat: " + users);
        } else if (msg == "/hello") {
            socket.send("Servidor: ¡Hellouda, bro!");
        } else if (msg == "/date") {
            var date = new Date(Date.now());
            socket.send(date.toDateString());
        } else if (msg == "/music") {
            socket.send("music");
        } else {
            socket.send('Comando incorrecto. Mirate la lista de comandos introduciendo "/help" anda');
        }
    } else if (msg == writing) {
        socket.broadcast.emit("message", msg);
    } else {
        //-- Reenviarlo a todos los clientes conectados
        io.send(msg);
        win.webContents.send('print-msg', msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);



//--------------------ELECTRON APP--------------------
//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
console.log("Arrancando electron...");
electron.app.on('ready', () => {
    //-- Aquí se crea la ventana y se hace lo relacionado con la gui
    //-- Pero el servidor no va aquí dentro, si no fuera, como en la práctica 3
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 800,   //-- Anchura 
        height: 800,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //win.setMenuBarVisibility(false)

  //-- Cargar interfaz gráfica en HTML
  let interfaz = "index.html"
  win.loadFile("index.html");

  //-- Obtener la información del sistema
  //-- versión de node
  node_v = process.versions.node;
  //-- versión de electron
  electron_v = process.versions.electron;
  //-- versión de chrome
  chrome_v = process.versions.chrome;
  //-- URL a ka qye se deben conectar los clientes
  //-- para chatear.
  dir_ip =  ip.address();
  //-- arquitectura
  arquitectura = process.arch;
  //-- plataforma
  plataforma = process.platform;
  //-- directorio
  directorio = process.cwd();
  //-- numero de usuarios conectados
  //-- users (ya definido)
  //-- puerto (ya definido) -> PUERTO
  //-- Agrupar información
  let info = [node_v, chrome_v, electron_v, dir_ip, arquitectura,
              plataforma, directorio, PUERTO, interfaz];

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    console.log("Enviando info".red);
    win.webContents.send('info', info);
  });
});

//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se manda un mensaje a los clientes
electron.ipcMain.handle('test', (event, msg) => {
    console.log("-> Mensaje: " + msg);
    //-- Enviar mensaje de prueba a todos los clientes
    io.send(msg);
});
