const http = require('http');
const fs = require('fs');
const url = require('url');

const PUERTO = 9090;

const mime = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'jpg'  : 'image/jpg',
    'ico'  : 'image/x-icon'
 };

const server = http.createServer((req, res)=>{
    console.log("Petición recibida!");

});

server.listen(PUERTO);

console.log("Server On. Listening in port: " + PUERTO);