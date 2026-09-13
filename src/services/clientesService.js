import axios from "axios";

const URL = "https://fakestoreapi.com/users";

const crearCliente = async (datosFormulario) => {
    const nuevoCliente = {
        email: datosFormulario.email,
        username: datosFormulario.nombre.toLowerCase().replace(/\s/g, ""),
        password: "1234",
        name: {
            firstname: datosFormulario.nombre,
            lastname: "-"
        },
        address: {
            city: datosFormulario.ciudad
        },
        phone: datosFormulario.telefono
    };

    const respuesta = await axios.post(URL, nuevoCliente);
    return respuesta.data;
};

export default {
    crearCliente
};