//-- Elementos del interfaz
const display = document.getElementById("display");
const message = document.getElementById("message");
const audio_msg = document.getElementById("audio_msg");
const music = document.getElementById("music");

//-- Variable para distinguir si un usuario está escribiendo
const writing = 'Un usuario está escribiendo...';
let write = false;

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

socket.on("message", (msg)=>{
  if (msg == 'music') {
    music.play();
  } else {
    display.innerHTML += '<p>' + msg + '</p>';
    if (msg != writing) {
      audio_msg.play();
    }
  }
  display.scrollTop = display.scrollHeight;
  
});
//-- Al escribir se manda a los demás que un usuario está escribiendo
message.oninput = () => {
  if (!write) {
    socket.send(writing);
    write = true;
  }
  
}
//-- Al apretar el botón se envía un mensaje al servidor
message.onchange = () => {
  if (message.value)
    socket.send(message.value);
    write = false;
  
  //-- Borrar el mensaje actual
  message.value = "";
}