# 🍴 Recetario Express

## 📌 Contexto
El **restaurante "Sabores del Mundo"** acaba de contratarlos como equipo de desarrollo web.  
Necesitan un **mini recetario online** donde sus clientes puedan buscar recetas y verlas de manera clara y atractiva.  

El gerente quiere una primera versión rápida para **mostrar a los inversores esta misma semana**, así que tienen **1 hora** para construir un prototipo funcional. 🚀

---

## 🎯 Objetivos de la actividad
- Practicar el uso de **fetch** para consumir datos desde una API pública.
- Aplicar **Bootstrap** para maquetar tarjetas, grillas y componentes visuales.
- Integrar **Font Awesome** para enriquecer la interfaz con íconos.
- Trabajar de forma colaborativa en equipo.

---

## 🔗 API a utilizar
Usaremos [TheMealDB](https://www.themealdb.com/), una API pública y gratuita que **no requiere clave**.

**API: https://www.themealdb.com/api/json/v1/1/search.php?s={NOMBRE RECETA BUSQUEDA}**
Recuerden: Reemplaza `{NOMBRE RECETA BUSQUEDA}` por la palabra que quieras buscar, por ejemplo `pasta` o `chicken`. ¿Dónde se escribe esta palabra en su página web?


## Guía del contenido de la API

Cuando hacemos una consulta a la API, la respuesta viene en JSON y tiene esta forma:
```json
{
  "meals": [
    {
      "idMeal": "52772",
      "strMeal": "Pasta Carbonara",
      "strDrinkAlternate": null,
      "strCategory": "Pasta",
      "strArea": "Italian",
      "strInstructions": "Cocinar la pasta y mezclar con la salsa...",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
      "strTags": "Pasta,Bacon",
      "strYoutube": "https://www.youtube.com/watch?v=3AAdKl1UYZs",
      "strIngredient1": "Pasta",
      "strIngredient2": "Bacon",
      "strIngredient3": "Huevo",
      "strIngredient4": "Parmesano",
      // ...
      "strMeasure1": "200g",
      "strMeasure2": "100g",
      "strMeasure3": "2",
      "strMeasure4": "50g",
      // ...
      "strSource": null,
      "dateModified": null
    }
  ]
}
```

### Campos que vamos a usar en la actividad

| Campo             | Qué contiene / Para qué usarlo                      |
|------------------|----------------------------------------------------|
| `idMeal`          | ID único de la receta. Sirve para buscar detalles |
| `strMeal`         | Nombre de la receta. Se muestra en la tarjeta     |
| `strCategory`     | Categoría de la receta (ej: Pasta, Chicken)       |
| `strMealThumb`    | Imagen de la receta. Se muestra en la tarjeta     |
| `strInstructions` | Instrucciones de preparación. Se muestra al hacer clic en “Ver detalles” |

### Ejemplo simplificado de JSON

```json
{
  "meals": [
    {
      "idMeal": "52772",
      "strMeal": "Pasta Carbonara",
      "strCategory": "Pasta",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
      "strInstructions": "Cocinar la pasta y mezclar con la salsa..."
    }
  ]
}
```

---

## 🛠️ Pasos sugeridos

1. **Estructura básica**  
    - Crear un archivo `index.html`, `script.js` y opcionalmente `styles.css`.
    - Vincular **Bootstrap** y **Font Awesome** desde un CDN.

2. **Interfaz inicial**  
    - Un campo de búsqueda para ingresar el nombre de una receta.  
    - Un botón con ícono de **lupa** para iniciar la búsqueda.  
    - Una sección vacía para mostrar los resultados.

3. **Conectar con la API**  
    - Usar `fetch` para buscar recetas según el texto ingresado.  
    - Mostrar **imagen, nombre y categoría** de cada receta en **cards de Bootstrap**.

4. **Detalles de receta**  
    - Al hacer clic en un botón “Ver detalles”, mostrar más información:  
        - Instrucciones de preparación.  
        - Lista de ingredientes (opcional).  
    - Pueden usar un **alert**, pero se recomienda mejorar con un **modal de Bootstrap**.

---

## ✨ Desafíos extra (para equipos rápidos)
- Implementar un **spinner de carga** de Bootstrap mientras se espera la respuesta.  
- Agregar un botón de **favoritos** ❤️ usando íconos de Font Awesome.  
- Permitir limpiar los resultados o realizar varias búsquedas sin recargar la página.  
- Cambiar el diseño de las cards para que se adapten bien en pantallas chicas (**responsive**).

---

## 📦 Entregable
Un proyecto simple con:
- `index.html`  
- `script.js`  
- (opcional) `styles.css`  

---

## 💡 Tip
El objetivo no es tener una aplicación perfecta, sino **explorar, probar y aprender** cómo combinar **fetch, Bootstrap y Font Awesome** en un proyecto práctico.

![Comida](https://images.vexels.com/media/users/3/262561/isolated/preview/d4e8a9986c2b7eb249a5f57b6684615a-comida-comida-pizza.png)
