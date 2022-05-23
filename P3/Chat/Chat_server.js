//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');

const PUERTO = 9090;

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

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    socket.broadcast.emit('message', goodbye);
    users -= 1;
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);

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
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);