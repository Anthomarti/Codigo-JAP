document.addEventListener("DOMContentLoaded", function () {
  // Escribe el código necesario aquí

  const boton = document.getElementById("highlightBtn");
  const parrafo = document.getElementById("lorem");

  boton.addEventListener("click", function () {
    parrafo.classList.add("highlight");
  });

  //
});
