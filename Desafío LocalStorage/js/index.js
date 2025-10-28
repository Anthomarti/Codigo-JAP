document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputText");
  const btn = document.getElementById("buttonText");
  const STORAGE_KEY = "datoIngresado";

  function guardar() {
    const valor = (input.value || "").trim();
    if (!valor) return;
    localStorage.setItem(STORAGE_KEY, valor);
  }

  btn.addEventListener("click", guardar);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") guardar();
  });
});
