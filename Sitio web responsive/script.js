const frases = [
  "…vestibulum mollis, tortor ac congue commodo",
  "…quis vulputate dolor augue ut mauris",
  "…laoreet, iaculis rhoncus neque porttitor"
];
const txt = document.getElementById("texto-carrusel");
let prev = -1;

function setFrase() {
  let i;
  do { i = Math.floor(Math.random() * frases.length); } while (i === prev);
  prev = i;
  txt.textContent = frases[i];
}
setFrase();
setInterval(setFrase, 2000);
