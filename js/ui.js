//funcion que actualiza el contador de productos en la nav
export const actualizarContador = (carrito) => {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = carrito.length;
    }
};

//mostramos mensajes con SweetAlert2 (Swal.fire)
export const mostrarMensaje = (texto) => {
    Swal.fire(texto);
};