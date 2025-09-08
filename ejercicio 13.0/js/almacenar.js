// Clave para localStorage
const CLAVE_LISTA = 'listadoItems';

// Referencias a elementos del DOM
const campoTexto = document.getElementById('item');
const botonAgregar = document.getElementById('agregar');
const botonLimpiar = document.getElementById('limpiar');
const contenedorLista = document.getElementById('contenedor');

// Obtener la lista desde localStorage
function obtenerLista() {
  try {
    const guardado = localStorage.getItem(CLAVE_LISTA);
    return guardado ? JSON.parse(guardado) : [];
  } catch (e) {
    console.warn('No se pudo leer la lista guardada, se reinicia.', e);
    localStorage.removeItem(CLAVE_LISTA);
    return [];
  }
}

// Guardar la lista en localStorage
function guardarLista(lista) {
  localStorage.setItem(CLAVE_LISTA, JSON.stringify(lista));
}

// Mostrar la lista en pantalla
function mostrarLista() {
  const lista = obtenerLista();
  contenedorLista.innerHTML = '';

  if (lista.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-muted';
    li.textContent = 'No hay ítems aún.';
    contenedorLista.appendChild(li);
    return;
  }

  lista.forEach((texto) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center';
    li.textContent = texto;
    contenedorLista.appendChild(li);
  });
}

// Agregar un nuevo ítem
function agregarItem() {
  const valor = (campoTexto.value || '').trim();
  if (!valor) {
    campoTexto.classList.add('is-invalid');
    campoTexto.focus();
    return;
  }
  campoTexto.classList.remove('is-invalid');

  const lista = obtenerLista();
  lista.push(valor);
  guardarLista(lista);

  mostrarLista();
  campoTexto.value = '';
  campoTexto.focus();
}

// Limpiar toda la lista
function limpiarLista() {
  localStorage.removeItem(CLAVE_LISTA);
  mostrarLista();
}

// Eventos
botonAgregar.addEventListener('click', agregarItem);
botonLimpiar.addEventListener('click', limpiarLista);

// Permitir Enter en el campo de texto
campoTexto.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') agregarItem();
});

// Render inicial al cargar la página
document.addEventListener('DOMContentLoaded', mostrarLista);

// Si vuelve a escribir, quitamos el error
campoTexto.addEventListener('input', () => campoTexto.classList.remove('is-invalid'));
