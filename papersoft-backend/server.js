const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// CONEXION MYSQL
const conexion = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "papersoft"
});

// PROBAR CONEXION
console.log("Intentando conectar...");

conexion.connect((error) => {

  if (error) {

    console.log("Error de conexión:", error);

  } else {

    console.log("MySQL conectado");

  }

});

// RUTA PRINCIPAL
app.get("/", (req, res) => {

  res.send("Servidor funcionando");

});

// OBTENER PRODUCTOS
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

// AGREGAR PRODUCTO
app.post("/agregar", (req, res) => {

  const {
    nombre_producto,
    precio,
    stock,
    categoria
  } = req.body;

  const sql = `
    INSERT INTO productos
    (nombre_producto, precio, stock, categoria)
    VALUES (?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [
      nombre_producto,
      precio,
      stock,
      categoria
    ],
    (error, resultado) => {

      if (error) {

        console.log(error);

        return res.status(500).json(error);

      }

      res.json({
        mensaje: "Producto agregado"
      });

    }
  );

});

// ELIMINAR PRODUCTO
app.delete("/eliminar/:id", (req, res) => {

  const id = req.params.id;

  const sql =
    "DELETE FROM productos WHERE id_producto = ?";

  conexion.query(
    sql,
    [id],
    (error, resultado) => {

      if (error) {

        console.log(error);

        return res.status(500).json(error);

      }

      res.json({
        mensaje: "Producto eliminado"
      });

    }
  );

});

// EDITAR PRODUCTO
app.put("/editar/:id", (req, res) => {

  const id = req.params.id;

  const {
    nombre_producto,
    precio,
    stock,
    categoria
  } = req.body;

  const sql = `
    UPDATE productos
    SET
    nombre_producto = ?,
    precio = ?,
    stock = ?,
    categoria = ?
    WHERE id_producto = ?
  `;

  conexion.query(
    sql,
    [
      nombre_producto,
      precio,
      stock,
      categoria,
      id
    ],
    (error, resultado) => {

      if (error) {

        console.log(error);

        return res.status(500).json(error);

      }

      res.json({
        mensaje: "Producto actualizado"
      });

    }
  );

});

// SERVIDOR
app.listen(3000, () => {

  console.log(
    "Servidor corriendo en puerto 3000"
  );

});