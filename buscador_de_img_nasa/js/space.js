// --- Referencias del DOM ---
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar   = document.getElementById("btnBuscar");
const contenedor  = document.getElementById("contenedor");

// --- Helpers ---
const NASA_URL = (q) =>
  `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image`;

// Limita texto para que las tarjetas no se hagan eternas
const recortar = (t = "", max = 220) =>
  t.length > max ? t.slice(0, max).trim() + "…" : t;

// Renderiza un mensaje simple (vacío, error, etc.)
function renderAviso(msg, tipo = "secondary") {
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} my-3" role="alert">${msg}</div>
  `;
}

// Crea una card Bootstrap para un item
function crearCard({ title, description, date_created, href }) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-4";

  // Formateo de fecha (YYYY-MM-DD)
  const fecha = date_created ? new Date(date_created).toISOString().slice(0, 10) : "Sin fecha";

  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${href}" class="card-img-top" alt="${title}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-1">${title || "Sin título"}</h5>
        <small class="text-muted mb-2">${fecha}</small>
        <p class="card-text">${recortar(description || "Sin descripción disponible")}</p>
      </div>
    </div>
  `;
  return col;
}

// Muestra lista de resultados en tarjetas
function mostrarResultados(items) {
  contenedor.innerHTML = ""; // limpia anteriores
  if (!items || items.length === 0) {
    renderAviso("No se encontraron imágenes para esa búsqueda.", "warning");
    return;
  }

  const row = document.createElement("div");
  row.className = "row g-3 my-2";

  items.forEach((it) => {
    // Desestructuración de la estructura NASA
    // Cada item tiene: data[0] con metadatos y links[] con imágenes
    const { data = [], links = [] } = it;
    const [meta] = data;
    const [{ href } = {}] = links; // primer link (imagen)

    if (!meta || !href) return; // si no hay imagen salteo

    const { title, description, date_created } = meta;
    row.appendChild(crearCard({ title, description, date_created, href }));
  });

  // Si todo lo que vino carecía de imagen, avisamos
  if (!row.children.length) {
    renderAviso("La búsqueda devolvió elementos sin imagen. Probá con otra palabra.", "info");
    return;
  }

  contenedor.appendChild(row);
}

// Llama a la API y procesa la respuesta
async function buscarImagenes(q) {
  contenedor.innerHTML = `<div class="text-center my-4">
    <div class="spinner-border text-primary" role="status"></div>
    <div class="mt-2 text-primary">Buscando en NASA…</div>
  </div>`;

  try {
    const res = await fetch(NASA_URL(q));
    if (!res.ok) throw new Error("Respuesta no OK");
    const json = await res.json();

    const items = json?.collection?.items ?? [];
    mostrarResultados(items);
  } catch (e) {
    console.error(e);
    renderAviso("Ocurrió un error consultando la API de NASA. Intenta nuevamente.", "danger");
  }
}

// --- Eventos ---
btnBuscar.addEventListener("click", () => {
  const q = (inputBuscar.value || "").trim();
  if (!q) return renderAviso("Ingresá una palabra para buscar (ej.: andromeda).", "secondary");
  buscarImagenes(q);
});

inputBuscar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnBuscar.click();
});
