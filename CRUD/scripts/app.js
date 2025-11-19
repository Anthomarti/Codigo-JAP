// Anthony, Hiago, Facundo, Mariana, Artur y Nicole
// URL base del mockapi
const URL = 'https://690bc4da6ad3beba00f620ca.mockapi.io/users';

// refs: función rápida para seleccionar elementos del DOM
const q = (s) => document.querySelector(s);
const results = q('#results');           // lista donde se muestran los registros
const alertBox = q('#alert-error');      // alerta de error

// campos y botones de "Buscar"
const inputGet1Id = q('#inputGet1Id');
const btnGet1 = q('#btnGet1');

// campos y botón de "Agregar"
const inputPostNombre = q('#inputPostNombre');
const inputPostApellido = q('#inputPostApellido');
const btnPost = q('#btnPost');

// campos, modal y botón de "Modificar"
const inputPutId = q('#inputPutId');
const btnPut = q('#btnPut');
const modalEl = q('#dataModal');
const inputPutNombre = q('#inputPutNombre');
const inputPutApellido = q('#inputPutApellido');
const btnSendChanges = q('#btnSendChanges');
const modal = new bootstrap.Modal(modalEl);  // inicializa el modal de Bootstrap

// campos y botón de "Borrar"
const inputDelete = q('#inputDelete');
const btnDelete = q('#btnDelete');

// --- función para mostrar alerta ---
const alerta = (m = 'Algo salió mal...') => {
  alertBox.textContent = m;              // muestra el mensaje
  alertBox.classList.add('show');        // activa la alerta
  setTimeout(() => alertBox.classList.remove('show'), 3000); // la oculta después de 3s
};

// --- función para mostrar los registros ---
const pintar = (arr) => {
  if (!arr || !arr.length) { // si no hay datos
    results.innerHTML = `<li class="list-group-item text-center text-muted">No hay registros para mostrar.</li>`;
    return;
  }
  // genera una lista con cada usuario
  results.innerHTML = arr.map(u => `
    <li class="list-group-item">
      <div><strong>ID:</strong> ${u.id}</div>
      <div><strong>Nombre:</strong> ${u.name ?? ''}</div>
      <div><strong>Apellido:</strong> ${u.lastname ?? ''}</div>
    </li>
  `).join('');
};

// --- función para habilitar/deshabilitar botones ---
const toggle = () => {
  btnPost.disabled = !(inputPostNombre.value.trim() && inputPostApellido.value.trim());
  btnPut.disabled  = !(inputPutId.value.trim());
  btnDelete.disabled = !(inputDelete.value.trim());
  btnSendChanges.disabled = !(inputPutNombre.value.trim() && inputPutApellido.value.trim());
};
// actualiza el estado de botones al escribir
[inputPostNombre, inputPostApellido, inputPutId, inputDelete, inputPutNombre, inputPutApellido]
  .forEach(el => el.addEventListener('input', toggle));

// --- al cargar, lista todos los registros ---
fetch(URL).then(r => r.ok ? r.json() : Promise.reject())
  .then(pintar).catch(() => alerta());

// --- Buscar: si se deja vacío, lista todo ---
btnGet1.addEventListener('click', async () => {
  btnGet1.disabled = true;
  try {
    const id = inputGet1Id.value.trim();
    const r = await fetch(id ? `${URL}/${encodeURIComponent(id)}` : URL);
    if (!r.ok) throw new Error('No se encontró el registro');
    const data = await r.json();
    pintar(Array.isArray(data) ? data : [data]); // si es uno, lo mete en array
  } catch (e) {
    alerta(e.message);
  } finally {
    btnGet1.disabled = false;
  }
});

// --- Agregar un nuevo registro ---
btnPost.addEventListener('click', async () => {
  if (btnPost.disabled) return;
  btnPost.disabled = true;
  try {
    // envía el nombre y apellido nuevos
    await fetch(URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: inputPostNombre.value.trim(), lastname: inputPostApellido.value.trim() })
    }).then(r => { if (!r.ok) throw new Error('No se pudo agregar'); });

    // limpia campos
    inputPostNombre.value = '';
    inputPostApellido.value = '';
    toggle();

    // vuelve a listar todo
    const lista = await fetch(URL).then(r => r.json());
    pintar(lista);
  } catch (e) {
    alerta(e.message);
  } finally {
    btnPost.disabled = false;
  }
});

// --- Modificar: abre modal con los datos cargados ---
btnPut.addEventListener('click', async () => {
  if (btnPut.disabled) return;
  btnPut.disabled = true;
  try {
    const r = await fetch(`${URL}/${encodeURIComponent(inputPutId.value.trim())}`);
    if (!r.ok) throw new Error('Registro no encontrado');
    const u = await r.json();
    // carga los datos existentes en el modal
    inputPutNombre.value = u.name ?? '';
    inputPutApellido.value = u.lastname ?? '';
    modalEl.dataset.id = u.id; // guarda el id que se está editando
    toggle();
    modal.show();              // muestra el modal
  } catch (e) {
    alerta(e.message);
  } finally {
    btnPut.disabled = false;
  }
});

// --- Guardar cambios del modal (PUT) ---
btnSendChanges.addEventListener('click', async () => {
  if (btnSendChanges.disabled) return;
  btnSendChanges.disabled = true;
  try {
    const id = modalEl.dataset.id; // id guardado al abrir modal
    const payload = {
      name: inputPutNombre.value.trim(),
      lastname: inputPutApellido.value.trim()
    };
    const r = await fetch(`${URL}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error('No se pudo modificar');
    modal.hide();

    // recarga la lista actualizada
    const lista = await fetch(URL).then(x => x.json());
    pintar(lista);
  } catch (e) {
    alerta(e.message);
  } finally {
    btnSendChanges.disabled = false;
  }
});

// --- Borrar un registro por id ---
btnDelete.addEventListener('click', async () => {
  if (btnDelete.disabled) return;
  btnDelete.disabled = true;
  try {
    const r = await fetch(`${URL}/${encodeURIComponent(inputDelete.value.trim())}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('No se pudo eliminar');
    inputDelete.value = ''; // limpia campo
    toggle();

    // vuelve a mostrar lista sin el eliminado
    const lista = await fetch(URL).then(x => x.json());
    pintar(lista);
  } catch (e) {
    alerta(e.message);
  } finally {
    btnDelete.disabled = false;
  }
});

// --- inicializa botones ---
toggle();
