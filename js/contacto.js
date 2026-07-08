import { obtenerCarrito } from "./storage.js";
import { actualizarContador, mostrarMensaje } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const carrito = obtenerCarrito();
    actualizarContador(carrito);

    const form = document.getElementById("form-contacto");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // evita que el navegador intente navegar a "action"
            mostrarMensaje("¡Mensaje enviado! Te contactaremos pronto.");
            form.reset();
        });
    }
});