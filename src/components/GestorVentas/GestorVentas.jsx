import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import "./GestorVentas.css";

const GestorVentas = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  // Cargar productos desde Firebase
  const cargarProductos = async () => {
    const itemsRef = collection(db, "items");
    const snapshot = await getDocs(itemsRef);
    const listaProductos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(listaProductos);
  };

  // Agregar un nuevo producto
  const agregarProducto = async () => {
    if (!nombre || !precio) {
      Swal.fire({
        title:"Error", 
        text:"Todos los campos son obligatorios", 
        icon:"error",
        background:'black',
        color:'white',
      });
      return;
    }

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
    };

    await addDoc(collection(db, "items"), nuevoProducto);
    setNombre("");
    setPrecio("");
    cargarProductos();
    Swal.fire({
      title:"Éxito", 
      text:"Producto agregado correctamente", 
      icon:"success",
      background:'black',
      color: 'white',
    });
  };

  // Vender un producto
  const venderProducto = async (servicio) => {
    const { value: cantidad } = await Swal.fire({
      title: "Ingrese la cantidad vendida",
      background: "black",
      color: "white",
      input: "number",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Registrar",
    });
  
    if (!cantidad || cantidad <= 0) return;
  
    const fecha = new Date();
    const anio = fecha.getFullYear().toString();
    const mes = fecha.toLocaleString("es-ES", { month: "long" }).toLowerCase(); // Mes en minúsculas
    const dia = fecha.getDate().toString().padStart(2, "0"); // Día con dos dígitos
  
    // Referencia a la colección "control" con la estructura {año} > {mes} > {día} > servicios
    const controlRef = doc(db, "control", anio);
    const controlSnap = await getDoc(controlRef);
    const controlData = controlSnap.exists() ? controlSnap.data() : {};
  
    // Asegurar estructura en la base de datos
    if (!controlData[mes]) controlData[mes] = {};
    if (!controlData[mes][dia]) controlData[mes][dia] = { servicios: {} };
  
    // Crear el registro del servicio vendido
    const servicioId = `${servicio.id}-${Date.now()}`;
    controlData[mes][dia].servicios[servicioId] = {
      fecha: fecha.toISOString().split("T")[0], // Formato YYYY-MM-DD
      servicio: servicio.nombre,
      precio: servicio.precio * cantidad,
    };
  
    // Guardar en Firestore
    await setDoc(controlRef, controlData, { merge: true });
  
    // Confirmación de éxito
    Swal.fire({
      title: "Servicio registrado",
      text: "El servicio se ha registrado con éxito",
      icon: "success",
      background: "black",
      color: "white",
    });
  };


  // Modificar el precio de un producto
  const modificarPrecio = async (producto) => {
    const { value: nuevoPrecio } = await Swal.fire({
      title: "Modificar Precio",
      background: 'black',
      color: 'white',
      input: "number",
      inputLabel: "Ingrese el nuevo precio",
      inputValue: producto.precio,
      inputAttributes: {
        min: 0,
        step: "0.01",
      },
      showCancelButton: true,
      confirmButtonText: "Actualizar",
    });

    if (!nuevoPrecio || nuevoPrecio <= 0) return;

    const productoRef = doc(db, "items", producto.id);
    await updateDoc(productoRef, { precio: parseFloat(nuevoPrecio) });
    cargarProductos();
    Swal.fire("Precio actualizado", "El precio ha sido modificado", "success");
  };

  // Eliminar un producto
  const eliminarProducto = async (producto) => {
    const confirmacion = await Swal.fire({
      title: "¿Seguro que quieres eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      background: 'black',
      color: 'white',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    const productoRef = doc(db, "items", producto.id);
    await deleteDoc(productoRef);
    cargarProductos();
    Swal.fire("Producto eliminado", "El producto ha sido eliminado", "success");
  };

  return (
    <div className="ventas-container">
      <h2>Gestión de Productos</h2>

      <div className="agregar-producto">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button onClick={agregarProducto}>Agregar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio.toFixed(2)}</td>
              <td>
                <button
                  className="accion-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    Swal.fire({
                      title: "Seleccione una acción",
                      showDenyButton: true,
                      showCancelButton: true,
                      icon: "warning",
                      background: 'black',
                      color: 'white',
                      confirmButtonText: "Vender",
                      denyButtonText: "Modificar Precio",
                      cancelButtonText: "Eliminar",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        venderProducto(producto);
                      } else if (result.isDenied) {
                        modificarPrecio(producto);
                      } else {
                        eliminarProducto(producto);
                      }
                    });
                  }}
                >
                  Acción
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestorVentas;
