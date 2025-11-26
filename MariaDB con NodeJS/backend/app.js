const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "planning",
  connectionLimit: 5,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// GET todas las tareas
app.get("/todo", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM todo");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// GET una tarea por ID
app.get("/todo/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM todo WHERE id=?", [
      req.params.id,
    ]);

    if (rows.length === 0) return res.status(404).json({ message: "No existe" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// POST crear tarea
app.post("/todo", async (req, res) => {
  const { name, description, status } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();

    const response = await conn.query(
      `INSERT INTO todo(name, description, status) VALUE(?, ?, ?)`,
      [name, description, status || "pending"]
    );

    res.json({
      id: response.insertId,
      name,
      description,
      status: status || "pending",
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// PUT actualizar
app.put("/todo/:id", async (req, res) => {
  const { name, description, status } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();

    await conn.query(
      `UPDATE todo SET name=?, description=?, status=? WHERE id=?`,
      [name, description, status, req.params.id]
    );

    res.json({
      id: req.params.id,
      name,
      description,
      status,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE eliminar
app.delete("/todo/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    await conn.query("DELETE FROM todo WHERE id=?", [req.params.id]);

    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
