# Mini Pokédex con JavaScript

En esta actividad vas a practicar el uso de **fetch**, manipulación del **DOM**, y la implementación de un **modo oscuro/claro** en una aplicación sencilla: una Pokédex.

---

## 📌 Consigna

1. Completa el código de `script.js` que se encuentra **incompleto**.
2. Al escribir el **nombre o ID** de un Pokémon en el input y presionar el botón **Buscar**, se debe consultar la [PokéAPI](https://pokeapi.co/) y mostrar:
   - Nombre del Pokémon.
   - Sprite (imagen).
   - Altura.
   - Peso.
3. Si el Pokémon no se encuentra, mostrar un mensaje de error con estilo.
4. Agregar un botón para cambiar entre **modo claro** y **modo oscuro**, que además cambie el estilo y el texto del propio botón.

---

## 📝 Pistas en el código

En `script.js` encontrarás espacios vacíos con comentarios y preguntas como:



## ❓ Preguntas para reflexionar

- ¿Cómo se usa addEventListener para escuchar un evento en un botón?

- En la promesa del fetch, ¿qué se recibe en el primer .then y cómo se transforma con response.json()?

- ¿Cómo accedo a los datos específicos de la API, como sprites.front_default, height o weight?

- ¿Qué diferencia hay entre manejar un fetch con .then/.catch y con async/await?

- ¿Cómo podria implementar Bootstrap en la respuesta de fetch?


## 🚀 Desafíos extra (opcional)

Si terminan la Pokédex básica, puedes intentar alguno de estos desafíos:

1. **Pokémon aleatorio**  
   - Agrega un botón que al hacer clic muestre un Pokémon aleatorio de la API.

2. **Mostrar tipos y habilidades**  
   - Además del nombre, altura y peso, muestra los **tipos** y **habilidades** de cada Pokémon.

3. **Mejoras de estilo con Bootstrap**  
   - Usa **cards, alerts o badges** de Bootstrap para mostrar los Pokémon y los mensajes de error de manera más atractiva.

4. **Animación o transición al cambiar de tema**  
   - Mejora el efecto del botón de modo oscuro/claro con animaciones o transiciones más visibles.



![Texto alternativo](/img/pokemon.png)

