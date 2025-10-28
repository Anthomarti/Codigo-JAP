// === Referencias DOM ===
const q = document.getElementById("q");
const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const results = document.getElementById("results");
const spinner = document.getElementById("spinner");

// Modal refs
const mealModal = new bootstrap.Modal(document.getElementById("mealModal"));
const mealTitle = document.getElementById("mealTitle");
const mealImg = document.getElementById("mealImg");
const mealCategory = document.getElementById("mealCategory");
const mealArea = document.getElementById("mealArea");
const mealIngredients = document.getElementById("mealIngredients");
const mealInstructions = document.getElementById("mealInstructions");
const mealLinks = document.getElementById("mealLinks");

// === Eventos ===
btnSearch.addEventListener("click", () => fetchMeals(q.value.trim()));
q.addEventListener("keydown", (e) => { if (e.key === "Enter") fetchMeals(q.value.trim()); });
btnClear.addEventListener("click", () => { q.value = ""; results.innerHTML = ""; q.focus(); });

// === API ===
const SEARCH_URL = (query) =>
  `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
const LOOKUP_URL = (id) =>
  `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`;

// Obtener recetas
async function fetchMeals(query) {
  results.innerHTML = "";
  if (!query) {
    results.innerHTML = emptyAlert("Escribe algo para buscar recetas.");
    return;
  }
  showSpinner(true);
  try {
    const res = await fetch(SEARCH_URL(query));
    const data = await res.json();
    displayMeals(data.meals || []);
  } catch (err) {
    console.error(err);
    results.innerHTML = errorAlert("Ocurrió un problema al buscar recetas.");
  } finally {
    showSpinner(false);
  }
}

// Mostrar tarjetas
function displayMeals(meals) {
  results.innerHTML = "";
  if (!meals || meals.length === 0) {
    results.innerHTML = emptyAlert("No se encontraron recetas con esa búsqueda.");
    return;
  }

  const frag = document.createDocumentFragment();

  meals.forEach((m) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${m.strMealThumb}" class="card-img-top" alt="${m.strMeal}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${m.strMeal}</h5>
          <span class="badge align-self-start">${m.strCategory || "Sin categoría"}</span>
          <div class="mt-auto d-grid gap-2">
            <button class="btn btn-warning" data-id="${m.idMeal}">
              <i class="fa-solid fa-circle-info"></i> Ver detalles
            </button>
          </div>
        </div>
      </div>
    `;

    // botón detalles
    col.querySelector("button").addEventListener("click", () => showDetails(m.idMeal));
    frag.appendChild(col);
  });

  results.appendChild(frag);
}

// Detalles (modal)
async function showDetails(id) {
  try {
    const res = await fetch(LOOKUP_URL(id));
    const data = await res.json();
    const meal = (data.meals && data.meals[0]) || null;
    if (!meal) return;

    // Título / imagen / chips
    mealTitle.textContent = meal.strMeal;
    mealImg.src = meal.strMealThumb;
    mealImg.alt = meal.strMeal;
    mealCategory.textContent = meal.strCategory || "N/A";
    mealArea.textContent = meal.strArea || "N/A";

    // Ingredientes + medidas (1..20)
    mealIngredients.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const mea = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        const li = document.createElement("li");
        li.textContent = `${ing}${mea ? ` — ${mea}` : ""}`;
        mealIngredients.appendChild(li);
      }
    }

    mealInstructions.textContent = meal.strInstructions || "Sin instrucciones.";

    // Links (YouTube / Fuente)
    mealLinks.innerHTML = "";
    if (meal.strYoutube) {
      mealLinks.insertAdjacentHTML(
        "beforeend",
        `<a class="btn btn-danger btn-sm me-2" href="${meal.strYoutube}" target="_blank" rel="noopener">
           <i class="fa-brands fa-youtube"></i> Video
         </a>`
      );
    }
    if (meal.strSource) {
      mealLinks.insertAdjacentHTML(
        "beforeend",
        `<a class="btn btn-outline-light btn-sm" href="${meal.strSource}" target="_blank" rel="noopener">
           <i class="fa-solid fa-arrow-up-right-from-square"></i> Fuente
         </a>`
      );
    }

    mealModal.show();
  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar los detalles de la receta.");
  }
}

// Utilidades UI
function showSpinner(show) {
  spinner.classList.toggle("d-none", !show);
}

function emptyAlert(msg) {
  return `
    <div class="col-12">
      <div class="alert alert-warning text-dark" role="alert">
        <i class="fa-regular fa-face-meh-blank"></i> ${msg}
      </div>
    </div>`;
}

function errorAlert(msg) {
  return `
    <div class="col-12">
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i> ${msg}
      </div>
    </div>`;
}
