# API CRUD - Planning (NodeJS + MariaDB)

## Pasos para ejecutar

1. Ejecutar `npm install` para instalar dependencias.
2. Crear la base de datos con el siguiente SQL:

CREATE DATABASE planning;
USE planning;
CREATE TABLE todo (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (id)
);

3. Ejecutar `npm run dev` para iniciar el servidor en puerto 3000.
4. Probar el CRUD mediante rutas:

GET    /todo
GET    /todo/:id
POST   /todo
PUT    /todo/:id
DELETE /todo/:id
