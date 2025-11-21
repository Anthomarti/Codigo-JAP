const URL = "https://official-joke-api.appspot.com/random_joke";

const btn = document.getElementById("btn");
const setup = document.getElementById("setup");
const punchline = document.getElementById("punchline");

btn.addEventListener("click", () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      setup.textContent = data.setup;
      punchline.textContent = "➤ " + data.punchline;
    })
    .catch(error => {
      setup.textContent = "Ups, hubo un error cargando el chiste.";
      punchline.textContent = "";
      console.error(error);
    });
});
