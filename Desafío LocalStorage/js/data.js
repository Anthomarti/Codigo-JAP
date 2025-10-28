document.addEventListener("DOMContentLoaded", () => {
  const salida = document.getElementById("data");
  const STORAGE_KEY = "datoIngresado";
  const valor = localStorage.getItem(STORAGE_KEY);
  salida.textContent = valor ?? "(sin datos)";
});
