let titulo = document.getElementById("titulo");
let parrafo = document.getElementById("parrafo");
let boton1 = document.getElementById("boton1");
let boton2 = document.getElementById("boton2");
let boton3 = document.getElementById("boton3");

boton1.addEventListener("click", function() {
    parrafo.textContent = "Este es un parrafo nuevo!";
});

boton2.addEventListener("click", function() {
    parrafo.style.color = "red";
});

boton3.addEventListener("click", function() {
    nombreasaludar = prompt("Su nombre para ser saludado! ", titulo.textContent);
    if (nombreasaludar) {
        parrafo.textContent = "Hola " + nombreasaludar + "!";
    } else {
        parrafo.textContent = "Hola persona desconocida!";
    }
});