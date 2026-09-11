import axios from "axios";

// Única fuente de verdad para la URL de la API de clientes.
// Ningún componente debe volver a escribir esta URL a mano:
// todo acceso a clientes pasa por las funciones de este service.
const URL_CLIENTES = "https://fakestoreapi.com/users";

// Manejo de errores unificado.
// axios rechaza la promesa tanto si la respuesta no es OK (4xx / 5xx)
// como si falla la red, así que acá se traducen los dos casos a un
// único Error con un mensaje ya listo para mostrar en pantalla.
const ejecutar = async (peticion, mensajeError) => {

    try {

        return await peticion();

    } catch (fallo) {

        const codigo = fallo.response?.status;

        throw new Error(
            codigo
                ? `${mensajeError} (código ${codigo})`
                : `${mensajeError} Revise su conexión.`
        );

    }
};

const crearCliente = async (cliente) => {

    const respuesta = await ejecutar(
        () => axios.post(URL_CLIENTES, cliente),
        "No se pudo crear el cliente."
    );

    return respuesta.data;
};

export default {
    crearCliente
};
