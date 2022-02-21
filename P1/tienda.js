//-- El servidor de mi tienda


//-- * Fichero .html
//-- * Ficheros con imagenes (.jpg, .png)
//-- * Ficheros .css
//---   Devolver el fichero pedido
//-- Si no localizo fichero: PAGINA DE ERROR

//-- CREAR UN SERVIDOR
//-- Se llama a la función de retrollamada
//-- cada vez que hay una petición

    //-- Localizar el recurso que nos piden
    //-- (sacarlo por la consola)
    //-- OBTENER el nombre del fichero

//-- LECTURA ASINCRONA del fichero
    //-- Función de retrollamada de lectura

    //-- Imprimir en la consola el nombre del fichero
    //-- que estoy leyendo

    //-- Si hay error, Generar la pag html de error

    //-- Si no hay error

        //-- Devolver el contenido como respuesta
        //-- La respuesta depende del tipo de fichero
            //-- HTML: Cabecera: 'Content-Type', 'text/html'
            //-- IMAGEN: 'image/jpg', 'image/png'
            //-- CSS: 'text/css'

            //-- ¿Como puedo saber que tipo fichero?
            //-- Por la extensión del fichero
            //-- Nombre fichero: "index.html", "hola.jpg"
            //-- A partir del nombre fichero, obtener su extensión
            //-- "html", "jpg", "png" ,"css" 