const numeros = [5, 2, 9, 1, 6];
const resultado = numeros
  .filter(n => n > 2)     // Filtra mayores que 2 → [5, 9, 6]
  .map(n => n * 2)        // Multiplica por 2 → [10, 18, 12]
  .sort((a, b) => a - b); // Ordena ascendente → [10, 12, 18]

console.log(resultado);
