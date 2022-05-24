const electron = require('electron');
const QRCode = require('qrcode');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const node_v = document.getElementById("info1");
const electron_v = document.getElementById("info2");
const chrome_v = document.getElementById("info3");
const arquitectura = document.getElementById("info4");
const plataforma = document.getElementById("info5");
const directorio = document.getElementById("info6");
const info_users = document.getElementById("users");
const display = document.getElementById("display");
const button_test = document.getElementById("button_test");
const dir_ip = document.getElementById("dir_ip");
const qr = document.getElementById("qr");

info_users.textContent = 0;

// Creamos el código QR
const src = 'http://' + ip.address() + ':' + '9090';
QRCode.toDataURL(src, function (err, url) {
    qr.src = url;
});

//-- Mensaje recibido del proceso Chat server con información.
electron.ipcRenderer.on('info', (event, message) => {
    console.log("Recibido: " + message);
    //-- Obtenemos la información que envia el servidor.
    node_v.textContent = message[0];
    chrome_v.textContent = message[1];
    electron_v.textContent = message[2];
    ip = message[3];
    arquitectura.textContent = message[4];
    plataforma.textContent = message[5];
    directorio.textContent = message[6];
    port = message[7];
    fich = message[8];

    //-- Definir la url con la informacion
    url = "http://" + ip + ":" + port + "/" + fich;
    dir_ip.textContent = url;
    
});

//-- Mensaje recibido del proceso Chat Server con el numero de usuarios.
electron.ipcRenderer.on('print-users', (event, message) => {
    console.log("Recibido: " + message);
    info_users.textContent = message;
});

//-- Mensaje recibido del proceso Chat Server con los mensajes de los usuarios.
electron.ipcRenderer.on('print-msg', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + '<br>';
});

//-- Funcionamiento del boton de test.
//-- Envia mensajes al proceso Chat Server.
button_test.onclick = () => {
    console.log("Botón apretado!");
    display.innerHTML += "¡A tope jefe de equipo! <br>";

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA");
}