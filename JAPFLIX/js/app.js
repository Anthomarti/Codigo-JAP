(() => {
  const URL = "https://japceibal.github.io/japflix_api/movies-data.json";

  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar   = document.getElementById("btnBuscar");
  const lista       = document.getElementById("lista");

  const oc         = document.getElementById("movieCanvas");
  const ocTitulo   = document.getElementById("movieCanvasLabel");
  const ocOverview = document.getElementById("movieOverview");
  const ocGenres   = document.getElementById("movieGenres");
  const ocMore     = document.getElementById("movieMore");
  const offcanvas  = new bootstrap.Offcanvas(oc, { backdrop: true });

  let pelis = [];

  function crearEstrellas(voteAverage) {
    const llenas = Math.round((voteAverage || 0) / 2);
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<span class="fa fa-star${i <= llenas ? " checked" : ""}"></span>`;
    }
    return html;
  }

  function money(n) {
    return (typeof n === "number" && n > 0) ? `$${n.toLocaleString("en-US")}` : "N/A";
  }

  function formatGenres(genres) {
    if (!Array.isArray(genres)) return "";
    return genres
      .map(g => typeof g === "string" ? g : g?.name ?? "")
      .filter(Boolean)
      .join(" - ");
  }

  function itemLista(p) {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action bg-dark text-white d-flex justify-content-between align-items-center";
    li.style.cursor = "pointer";
    li.innerHTML = `
      <div class="me-3">
        <h5 class="mb-1">${p.title}</h5>
        <small class="text-secondary">${p.tagline || ""}</small>
      </div>
      <div class="text-nowrap">${crearEstrellas(p.vote_average)}</div>
    `;
    li.addEventListener("click", () => abrirFicha(p));
    return li;
  }

  function abrirFicha(p) {
    ocTitulo.textContent = p.title;
    ocOverview.textContent = p.overview || "";
    ocGenres.innerHTML = `<strong>Géneros:</strong> ${formatGenres(p.genres)}`;

    const year    = (p.release_date || "").toString().slice(0, 4) || "N/A";
    const runtime = (p.runtime && p.runtime > 0) ? `${p.runtime} mins` : "N/A";

    ocMore.innerHTML = `
      <li><span class="dropdown-item-text"><strong>Year:</strong> ${year}</span></li>
      <li><span class="dropdown-item-text"><strong>Runtime:</strong> ${runtime}</span></li>
      <li><span class="dropdown-item-text"><strong>Budget:</strong> ${money(p.budget)}</span></li>
      <li><span class="dropdown-item-text"><strong>Revenue:</strong> ${money(p.revenue)}</span></li>
    `;

    offcanvas.show();
  }

  function buscarYListar() {
    const q = (inputBuscar.value || "").trim().toLowerCase();
    lista.innerHTML = "";
    if (!q) return;

    const match = (v) => (v || "").toString().toLowerCase().includes(q);

    const results = pelis.filter(p =>
      match(p.title) ||
      match(p.tagline) ||
      match(p.overview) ||
      formatGenres(p.genres).toLowerCase().includes(q)
    );

    if (results.length === 0) {
      lista.innerHTML = `<li class="list-group-item bg-dark text-secondary">Sin resultados para "<em>${q}</em>"</li>`;
      return;
    }

    const frag = document.createDocumentFragment();
    results.forEach(p => frag.appendChild(itemLista(p)));
    lista.appendChild(frag);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch(URL);
      pelis = await res.json();
    } catch (e) {
      console.error("Error cargando películas:", e);
    }
  });

  btnBuscar.addEventListener("click", buscarYListar);
  inputBuscar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarYListar();
  });
})();
