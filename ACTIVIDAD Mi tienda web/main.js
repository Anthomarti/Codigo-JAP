const STORAGE_KEY = 'carrito';

function obtenerCarrito() {
  const guardado = localStorage.getItem(STORAGE_KEY);
  console.log('[obtenerCarrito] valor crudo en localStorage:', guardado);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
  console.log('[guardarCarrito] guardando carrito:', carrito);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

function inicializarPaginaProductos() {
  const botonesAgregar = document.querySelectorAll('.agregar');
  if (!botonesAgregar.length) {
    console.log('[productos] No hay botones ".agregar": no estamos en productos.html');
    return; // No estamos en productos.html
  }

  console.log('[productos] Inicializando página de productos...');

  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', () => {
      const card = boton.closest('.card');

      const nombre = card.querySelector('.card-title').textContent.trim();
      const precioTexto = card.querySelector('.card-text').textContent.trim();
      const precio = Number(precioTexto.replace('$', '').trim());

      const inputCantidad = card.querySelector('.cantidad');
      let cantidad = Number(inputCantidad.value);

      const imagen = card.querySelector('.product-img')?.src || '';

      console.log('[productos] Click en agregar:', { nombre, precio, cantidad, imagen });

      // Validación de cantidad
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        alert('Por favor ingresá una cantidad mayor a 0.');
        return;
      }

      // Obtenemos el carrito actual
      const carrito = obtenerCarrito();

      // Si el producto ya existe en el carrito, sumamos cantidad
      const indiceExistente = carrito.findIndex(
        (item) => item.producto === nombre
      );

      if (indiceExistente >= 0) {
        carrito[indiceExistente].cantidad += cantidad;
      } else {
        carrito.push({
          producto: nombre,
          precio: precio,
          cantidad: cantidad,
          imagen: imagen,
        });
      }

      // Guardamos en localStorage
      guardarCarrito(carrito);

      // Feedback al usuario
      alert('Producto agregado al carrito.');
      inputCantidad.value = 0;
    });
  });
}

function calcularTotalGeneral(carrito) {
  return carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
}

function renderizarCarrito() {
  const contenedorCarrito = document.getElementById('carrito');
  if (!contenedorCarrito) {
    console.log('[carrito] No hay elemento con id="carrito": no estamos en carrito.html');
    return; // no estamos en carrito.html
  }

  const spanTotal = document.getElementById('total');
  console.log('[carrito] Inicializando carrito...');

  const carrito = obtenerCarrito();
  console.log('[carrito] Carrito obtenido:', carrito);

  contenedorCarrito.innerHTML = '';

  // Si no hay productos, mostramos mensaje
  if (!carrito.length) {
    contenedorCarrito.innerHTML = `
      <div class="col-12">
        <p class="text-center">No hay productos en el carrito.</p>
      </div>
    `;
    if (spanTotal) spanTotal.textContent = '0';
    return;
  }

  let totalGeneral = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    totalGeneral += subtotal;

    const col = document.createElement('div');
    col.className = 'col-md-6';

    col.innerHTML = `
      <div class="card p-3 bg-secondary text-light h-100">
        <img src="${item.imagen}" class="card-img-top mb-2 product-img" alt="${item.producto}">
        <h5 class="card-title">${item.producto}</h5>
        <p class="card-text">Precio: $${item.precio}</p>
        
        <label class="form-label">Cantidad:</label>
        <input 
          type="number" 
          min="1" 
          value="${item.cantidad}" 
          class="form-control mb-2 cantidad-carrito" 
          data-index="${index}"
        >

        <p class="mb-0">
          Subtotal: $<span class="subtotal" data-index="${index}">${subtotal}</span>
        </p>

        <button class="btn btn-sm btn-danger mt-2 eliminar" data-index="${index}">
          Eliminar
        </button>
      </div>
    `;

    contenedorCarrito.appendChild(col);
  });

  // Mostrar total general
  if (spanTotal) {
    spanTotal.textContent = totalGeneral;
  }

  // Listeners para cambios de cantidad
  const inputsCantidad = contenedorCarrito.querySelectorAll('.cantidad-carrito');
  inputsCantidad.forEach((input) => {
    input.addEventListener('input', manejarCambioCantidad);
  });

  // Listeners para eliminar producto (bonus)
  const botonesEliminar = contenedorCarrito.querySelectorAll('.eliminar');
  botonesEliminar.forEach((btn) => {
    btn.addEventListener('click', manejarEliminarProducto);
  });
}

function manejarCambioCantidad(event) {
  const input = event.target;
  const index = Number(input.dataset.index);
  let nuevaCantidad = Number(input.value);

  const carrito = obtenerCarrito();

  if (!Number.isFinite(nuevaCantidad) || nuevaCantidad <= 0) {
    // Si ponen 0 o algo inválido, volvemos al valor anterior
    input.value = carrito[index].cantidad;
    alert('La cantidad debe ser mayor a 0.');
    return;
  }

  carrito[index].cantidad = nuevaCantidad;
  guardarCarrito(carrito);

  // Actualizar subtotal de ese producto
  const nuevoSubtotal = carrito[index].precio * carrito[index].cantidad;
  const spanSubtotal = document.querySelector(
    `.subtotal[data-index="${index}"]`
  );
  if (spanSubtotal) {
    spanSubtotal.textContent = nuevoSubtotal;
  }

  // Actualizar total general
  const spanTotal = document.getElementById('total');
  if (spanTotal) {
    spanTotal.textContent = calcularTotalGeneral(carrito);
  }
}

// BONUS: eliminar producto del carrito
function manejarEliminarProducto(event) {
  const index = Number(event.target.dataset.index);
  const carrito = obtenerCarrito();

  carrito.splice(index, 1); // eliminamos ese producto
  guardarCarrito(carrito);

  // Volvemos a dibujar el carrito
  renderizarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarPaginaProductos();
  renderizarCarrito();
});