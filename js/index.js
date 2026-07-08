//funciones para enviar objetos al array
import { agregarAlCarrito } from "./funcionesCarrito.js";
import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";

//Funcion que creamos que se ocupe de renderizar las tarjetas del producto
const renderizarProductos = () => {
    const contenedor = document.getElementById("contenedor-tarjetas");

    fetch("./data/productos.json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((producto) => {
                // Lógica para renderizar cada producto
                const tarjeta = document.createElement("article");
                tarjeta.classList.add("card", "text-dark");

                const img = document.createElement("img");
                img.src = `./img/${producto.imagen}`;
                img.alt = producto.nombre;
                
                const titulo = document.createElement("h3");
                titulo.textContent = producto.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = producto.descripcion;

                const precio = document.createElement("p");
                precio.textContent = `$${producto.precio}`;

                const boton = document.createElement("button");
                boton.classList.add("btn", "bg-secondary", "text-dark");
                boton.textContent = "Agregar al carrito";
                
                boton.addEventListener("click", () => {
                    agregarAlCarrito(producto);
                });

                tarjeta.appendChild(titulo);
                tarjeta.appendChild(img);
                tarjeta.appendChild(descripcion);
                tarjeta.appendChild(precio);
                tarjeta.appendChild(boton);
                contenedor.appendChild(tarjeta);
                
            });
        })
        .catch((error) => {
            console.error("Error al obtener los productos:", error);
        });
};

document.addEventListener("DOMContentLoaded", () => {
    const carrito = obtenerCarrito();
    actualizarContador(carrito);
    renderizarProductos();
});