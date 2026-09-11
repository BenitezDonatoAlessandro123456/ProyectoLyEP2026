import axios from "axios";

// Única fuente de verdad para la URL de la API de clientes.
// Ningún componente debe volver a escribir esta URL a mano:
// todo acceso a clientes pasa por las funciones de este service.
const URL_CLIENTES = "https://fakestoreapi.com/users";

const crearCliente = async (cliente) => {

    const respuesta = await axios.post(
        URL_CLIENTES,
        cliente
    );

    return respuesta.data;
};

export default {
    crearCliente
};
