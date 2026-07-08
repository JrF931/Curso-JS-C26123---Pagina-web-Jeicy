import { obtenerCarrito, vaciarCarrito } from "./storage.js";
import { eliminarProducto } from "./funcionesCarrito.js";
import { actualizarContador, mostrarMensaje } from "./ui.js";

const COSTO_ENVIO = 5000;

//calcula el subtotal de los productos del carrito
const calcularSubtotal = (carrito) => {
    return carrito.reduce((acumulado, producto) => acumulado + producto.precio, 0);
};

//calcula el total final segun el metodo de entrega elegido
const calcularTotal = (carrito) => {
    const subtotal = calcularSubtotal(carrito);
    const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked');
    const esEnvio = entregaSeleccionada && entregaSeleccionada.value === "envio";
    return esEnvio ? subtotal + COSTO_ENVIO : subtotal;
};

//actualiza el texto del total dentro del formulario de checkout
const actualizarTotalCheckout = (carrito) => {
    const totalTexto = document.getElementById("total-checkout");
    if (!totalTexto) return;

    const total = calcularTotal(carrito);
    totalTexto.textContent = `Total a pagar: $${total.toLocaleString("es-AR")}`;
};

//muestra u oculta los campos segun el metodo de pago elegido
const actualizarCamposPago = () => {
    const pagoSeleccionado = document.querySelector('input[name="pago"]:checked').value;

    const datosTransferencia = document.getElementById("datos-transferencia");
    const datosDebito = document.getElementById("datos-debito");

    datosTransferencia.hidden = pagoSeleccionado !== "transferencia";
    datosDebito.hidden = pagoSeleccionado !== "debito";
};

//muestra u oculta el horario de retiro segun el metodo de entrega elegido
const actualizarCamposEntrega = (carrito) => {
    const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked').value;
    const datosRetiro = document.getElementById("datos-retiro");

    datosRetiro.hidden = entregaSeleccionada !== "retiro";

    //cada vez que cambia el metodo de entrega, el total puede cambiar (costo de envio)
    actualizarTotalCheckout(carrito);
};

//arma el resumen simple del carrito (subtotal de productos)
const renderizarResumen = (carrito) => {
    const resumen = document.getElementById("resumen-carrito");
    resumen.innerHTML = "";

    if (!carrito.length) return;

    const subtotal = calcularSubtotal(carrito);
    const parrafoSubtotal = document.createElement("p");
    parrafoSubtotal.classList.add("subtotal-carrito");
    parrafoSubtotal.textContent = `Subtotal: $${subtotal.toLocaleString("es-AR")}`;

    resumen.appendChild(parrafoSubtotal);
};

const renderizarCarrito = () => {
    const carrito = obtenerCarrito();
    actualizarContador(carrito);

    const contenedor = document.getElementById("contenedor-carrito");
    const divAcciones = document.getElementById("acciones-carrito");
    const checkout = document.getElementById("checkout-carrito");

    //para resetear el carrito cada vez que se borre un producto
    contenedor.innerHTML = "";
    divAcciones.innerHTML = "";

    //si el carrito esta vacio, ocultamos el formulario de checkout tambien
    if (!carrito.length){
        const mensaje = document.createElement("p");
        mensaje.classList.add("mensaje-carrito-vacio");
        mensaje.textContent = "tu carrito esta vacio";

        contenedor.appendChild(mensaje);
        renderizarResumen(carrito);
        checkout.hidden = true;
        return;
    }

    //Todo esto es cuando hay productos
    carrito.forEach((producto, index) => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("card");

        const img = document.createElement("img");
        img.src = `../img/${producto.imagen}`;
        img.alt = producto.nombre;

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = `$${producto.precio}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn");
        btnEliminar.classList.add("btn-eliminar-carrito");
        btnEliminar.textContent = "Eliminar producto";

        btnEliminar.addEventListener("click", () => {
            eliminarProducto(index);
            //una vez que se elimina el producto hay que volver
            //a reconstruir el DOM con la info actual del localStorage
            renderizarCarrito();
        });

        tarjeta.appendChild(img);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(btnEliminar);

        contenedor.appendChild(tarjeta);
    });

    const btnVaciar = document.createElement("button");
    btnVaciar.classList.add("btn");
    btnVaciar.classList.add("btn-vaciar-carrito");
    btnVaciar.textContent = "Vaciar carrito";

    btnVaciar.addEventListener("click", () => {
        vaciarCarrito();
        renderizarCarrito();
    });

    const btnFinalizar = document.createElement("button");
    btnFinalizar.classList.add("btn");
    btnFinalizar.classList.add("bg-secondary");
    btnFinalizar.classList.add("text-dark");
    btnFinalizar.textContent = "Finalizar compra";

    btnFinalizar.addEventListener("click", () => {
        checkout.hidden = false;
        actualizarTotalCheckout(carrito);
        checkout.scrollIntoView({ behavior: "smooth" });
    });

    divAcciones.appendChild(btnVaciar);
    divAcciones.appendChild(btnFinalizar);

    renderizarResumen(carrito);
    actualizarTotalCheckout(carrito);
};

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();

    //listeners de los radio buttons (se agregan una sola vez)
    document.querySelectorAll('input[name="pago"]').forEach((radio) => {
        radio.addEventListener("change", actualizarCamposPago);
    });

    document.querySelectorAll('input[name="entrega"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            const carrito = obtenerCarrito();
            actualizarCamposEntrega(carrito);
        });
    });

    //envio del formulario de checkout
    const formCheckout = document.getElementById("form-checkout");
    formCheckout.addEventListener("submit", (e) => {
        e.preventDefault();

        const carrito = obtenerCarrito();
        if (!carrito.length) return;

        const total = calcularTotal(carrito);
        mostrarMensaje(`¡Gracias por tu compra! Total: $${total.toLocaleString("es-AR")}`);

        vaciarCarrito();
        formCheckout.reset();
        renderizarCarrito();
    });
});