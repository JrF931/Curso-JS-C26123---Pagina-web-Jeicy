import{
    guardarCarrito,
    obtenerCarrito,
    vaciarCarrito,
} from "./storage.js";

import { actualizarContador, mostrarMensaje } from "./ui.js";

export const agregarAlCarrito = (producto) => {
    //usamos la funcion que pide el carrito al localStorage
    const carrito = obtenerCarrito();
    carrito.push(producto);

    //usamos la funcion que guarda el carrito en el localstorage
    guardarCarrito(carrito);

    //usamos la funcion UI que actualiza en numero en carrito
    actualizarContador(carrito);
    mostrarMensaje("Producto agregado al carrito");
};

export const eliminarProducto = (indice) => {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    actualizarContador(carrito);
    mostrarMensaje("Producto eliminado del carrito");
};

export const vaciarCarritoUI = () => {
    vaciarCarrito();
    actualizarContador([]);
    mostrarMensaje("Carrito vaciado");
};