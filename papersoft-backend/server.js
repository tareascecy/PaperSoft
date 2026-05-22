const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ===============================
// CONEXIÓN MYSQL (CLOUD / RENDER)
// ===============================
const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
});

// PROBAR CONEXIÓN
console.log("Intentando conectar...");

conexion.connect((error) => {
  if (error) {
    console.log("❌ Error de conexión:", error);
  } else {
    console.log("✅ MySQL conectado");
  }
});

// ===============================
// RUTA PRINCIPAL
// ===============================
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// ===============================
// OBTENER PRODUCTOS
// ===============================
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json(resultados);
  });
});

// ===============================
// AGREGAR PRODUCTO
// ===============================
app.post("/agregar", (req, res) => {
  const { nombre_producto, precio, stock, categoria } = req.body;

  const sql = `
    INSERT INTO productos (nombre_producto, precio, stock, categoria)
    VALUES (?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [nombre_producto, precio, stock, categoria],
    (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      }

      res.json({ mensaje: "Producto agregado" });
    }
  );
});

// ===============================
// ELIMINAR PRODUCTO
// ===============================
app.delete("/eliminar/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM productos WHERE id_producto = ?";

  conexion.query(sql, [id], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json({ mensaje: "Producto eliminado" });
  });
});

// ===============================
// EDITAR PRODUCTO
// ===============================
app.put("/editar/:id", (req, res) => {
  const id = req.params.id;
  const { nombre_producto, precio, stock, categoria } = req.body;

  const sql = `
    UPDATE productos
    SET nombre_producto = ?, precio = ?, stock = ?, categoria = ?
    WHERE id_producto = ?
  `;

  conexion.query(
    sql,
    [nombre_producto, precio, stock, categoria, id],
    (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      }

      res.json({ mensaje: "Producto actualizado" });
    }
  );
});

// ===============================
// SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});