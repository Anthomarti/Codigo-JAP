document.addEventListener('DOMContentLoaded', function () {
    
// Obtener todos los enlaces de la página
let enlaces = document.getElementsByTagName('a');

// 1. Número de enlaces
let cantidadEnlaces = enlaces.length;

// 2. Dirección del penúltimo enlace
let penultimoEnlace = enlaces[enlaces.length - 2].href;

// 3. Número de enlaces que apuntan a http://prueba/
let enlacesAPrueba = 0;
for (let i = 0; i < enlaces.length; i++) {
    if (enlaces[i].href === "http://prueba/") {
        enlacesAPrueba++;
    }
}

// 4. Número de enlaces en el tercer párrafo
let parrafos = document.getElementsByTagName('p');
let tercerParrafo = parrafos[2]; // El tercer párrafo está en la posición 2
let enlacesEnTercerParrafo = tercerParrafo.getElementsByTagName('a').length;

// Mostrar la información en el elemento con id="info"
let info = document.getElementById('info');
info.innerHTML = `
    <p>Número de enlaces de la página: ${cantidadEnlaces}</p>
    <p>Dirección del penúltimo enlace: ${penultimoEnlace}</p>
    <p>Número de enlaces que enlazan a http://prueba/: ${enlacesAPrueba}</p>
    <p>Número de enlaces en el tercer párrafo: ${enlacesEnTercerParrafo}</p>
`;

});