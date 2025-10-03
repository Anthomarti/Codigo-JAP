// 1. Seleccionar elementos del DOM
const input = document.getElementById("pokemonInput");
const buscarBtn = document.getElementById("searchBtn");
const pokedex = document.getElementById("pokedex");
const modoBtn = document.getElementById("themeBtn");

// 2. Evento para buscar Pokémon
// ❓ Pregunta: ¿A qué elemento debemos agregar el evento "click" para iniciar la búsqueda?
// ❓ Pregunta: ¿Qué valor debemos obtener del input para pasarlo a la API?

/* COMPLETAR: agregar el evento al botón de búsqueda */ ("click", () => {
  const inputValor = /* COMPLETAR: obtener el valor del input y pasarlo a minúsculas */;
  if (inputValor) {
    // ❓ Pregunta: ¿Qué hace fetch en este contexto?
    fetch(`https://pokeapi.co/api/v2/pokemon/${/* COMPLETAR: variable con el nombre o ID */}`)
      .then(response => {
        // ❓ Pregunta: ¿Qué debemos hacer con la respuesta antes de usarla?
        return /* COMPLETAR: convertir respuesta a JSON */;
      })
      .then(data => {
        // ❓ Pregunta: ¿Qué propiedades de "data" necesitamos para mostrar el Pokémon?
        pokedex.innerHTML = `
          <h2>${/* nombre del Pokémon */}</h2>
          <img src="${/* sprite del Pokémon */}" alt="${/* nombre */}">
          <p><strong>Altura:</strong> ${/* altura */}</p>
          <p><strong>Peso:</strong> ${/* peso */}</p>
        `;
      })
      .catch(error => {
        // ❓ Pregunta: ¿Por qué es importante manejar errores aquí?
        pokedex.innerHTML = `<p class="error">⚠️ Pokémon no encontrado</p>`;
      });
  }
});

// 3. Botón de modo oscuro/claro
// ❓ Pregunta: ¿Qué clase debemos alternar en el body para cambiar entre temas?
// ❓ Pregunta: ¿Cómo podemos actualizar el texto del botón según el modo activo?
themeBtn.addEventListener("click", () => {
  /* COMPLETAR: alternar entre las clases "dark" y "light" en el body */
  
  if (/* COMPLETAR: condición para verificar si el body tiene la clase "dark" */) {
    themeBtn.textContent = "Cambiar a modo claro";
  } else {
    themeBtn.textContent = "Cambiar a modo oscuro";
  }
});

// Iniciamos con tema claro por defecto
/* COMPLETAR: agregar la clase inicial "light" al body */
