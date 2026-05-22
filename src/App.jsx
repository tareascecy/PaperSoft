import { useState, useEffect } from "react";

function App() {

  // 🔴 CAMBIA ESTA URL POR TU BACKEND EN RENDER
  const API = "https://TU-BACKEND.onrender.com";

  // ESTADOS
  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    precio: "",
    stock: "",
    categoria: ""
  });

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // OBTENER PRODUCTOS
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(`${API}/productos`);
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.log(error);
      alert("Error al obtener productos");
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // CAPTURAR INPUTS
  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  // GUARDAR (AGREGAR / EDITAR)
  const guardarProducto = async (e) => {
    e.preventDefault();

    try {

      if (editando) {

        const respuesta = await fetch(`${API}/editar/${idEditar}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto)
        });

        const datos = await respuesta.json();
        alert(datos.mensaje);

        setEditando(false);
        setIdEditar(null);

      } else {

        const respuesta = await fetch(`${API}/agregar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto)
        });

        const datos = await respuesta.json();
        alert(datos.mensaje);
      }

      obtenerProductos();

      setNuevoProducto({
        nombre_producto: "",
        precio: "",
        stock: "",
        categoria: ""
      });

    } catch (error) {
      console.log(error);
      alert("Error al guardar producto");
    }
  };

  // ELIMINAR
  const eliminarProducto = async (id) => {

    const confirmar = window.confirm("¿Desea eliminar este producto?");
    if (!confirmar) return;

    try {
      const respuesta = await fetch(`${API}/eliminar/${id}`, {
        method: "DELETE"
      });

      const datos = await respuesta.json();
      alert(datos.mensaje);

      obtenerProductos();

    } catch (error) {
      console.log(error);
      alert("Error al eliminar producto");
    }
  };

  // EDITAR
  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria
    });

    setEditando(true);
    setIdEditar(producto.id_producto);
  };

  return (
    <div className="bg-light min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">PaperSoft</span>
        </div>
      </nav>

      {/* TITULO */}
      <div className="container text-center mt-4">
        <h1 className="text-primary">Sistema PaperSoft</h1>
        <p>Gestión de productos</p>
      </div>

      {/* FORMULARIO */}
      <div className="container mt-4">
        <div className="card p-3 shadow">

          <form onSubmit={guardarProducto} className="row g-2">

            <input className="form-control col"
              placeholder="Producto"
              name="nombre_producto"
              value={nuevoProducto.nombre_producto}
              onChange={handleChange}
              required
            />

            <input className="form-control col"
              placeholder="Precio"
              name="precio"
              type="number"
              value={nuevoProducto.precio}
              onChange={handleChange}
              required
            />

            <input className="form-control col"
              placeholder="Stock"
              name="stock"
              type="number"
              value={nuevoProducto.stock}
              onChange={handleChange}
              required
            />

            <input className="form-control col"
              placeholder="Categoría"
              name="categoria"
              value={nuevoProducto.categoria}
              onChange={handleChange}
              required
            />

            <button className="btn btn-success col">
              {editando ? "Actualizar" : "Guardar"}
            </button>

          </form>

        </div>
      </div>

      {/* TABLA */}
      <div className="container mt-4">

        <table className="table table-striped">

          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.id_producto}</td>
                <td>{p.nombre_producto}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>{p.categoria}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2"
                    onClick={() => editarProducto(p)}>
                    Editar
                  </button>

                  <button className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(p.id_producto)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;