const DATA = [
  { name: "Laura", lastname: "Hightower" },
  { name: "Roberto", lastname: "Carlos" },
  { name: "Fulano", lastname: "Detal" },
  { name: "Joaquina", lastname: "Hand" },
  { name: "Maria", lastname: "White" },
];

// Escribe el código necesario aquí

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");

  DATA.forEach(persona => {
    const p = document.createElement("p");
    p.textContent = `${persona.name} ${persona.lastname}`;
    container.appendChild(p);
  });
});

//
