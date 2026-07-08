//este archivo va a unificar las funciones de persistencia del carrito en el storage en formato json
const KEY = "carrito";

export const guardarCarrito = (carrito) => {
    //convertimos en json antes de guardar con stringify
    localStorage.setItem(KEY, JSON.stringify(carrito));
};

export const obtenerCarrito = () => {
    //convertimos a js para obtener los datos con parse
    return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const vaciarCarrito = () => {
    localStorage.removeItem(KEY);
};