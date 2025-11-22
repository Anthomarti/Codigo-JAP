# Mi Mini Tienda 

## Objetivos de la actividad
1. Practicar el uso de **localStorage** para enviar información entre páginas.  
2. Implementar cálculo de **subtotal en tiempo real** usando JavaScript y manipulación del DOM.  
3. Trabajar en equipo aplicando eventos, inputs y almacenamiento local.

---

## Descripción de la actividad
En esta actividad, cada equipo creará una **mini tienda** con dos páginas:

1. `productos.html` – Página donde se muestran los productos disponibles y se puede seleccionar la cantidad de cada uno.  
2. `carrito.html` – Página que muestra los productos agregados al carrito, sus subtotales y el total final.  

---

## Requerimientos
- Al hacer clic en el botón **“Agregar al carrito”** en `productos.html`, el producto y la cantidad deben almacenarse en **localStorage**.  
- En `carrito.html` se deben mostrar todos los productos del carrito, con su cantidad y subtotal.  
- Cada vez que se cambie la cantidad en el carrito, **el subtotal y el total deben actualizarse en tiempo real**.  

### Bonus (opcional)
- Permitir eliminar productos del carrito y actualizar el total automáticamente.  

---

## Recomendaciones
- Crear funciones para manejar:  
    - Guardar productos en localStorage  
    - Leer productos de localStorage  
    - Calcular subtotal y total  
    - Actualizar el DOM dinámicamente  

- Probar constantemente en el navegador y usar la consola para depuración.  

---

## Links de navegación
- Desde `productos.html` se debe poder ir a `carrito.html`.  
- Desde `carrito.html` se debe poder volver a `productos.html` para seguir agregando productos.

