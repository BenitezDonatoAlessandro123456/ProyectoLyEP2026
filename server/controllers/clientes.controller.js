import Cliente from '../models/Cliente.js';

export const getClientes = async (req, res, next) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        next(error);
    }
};

export const getCliente = async (req, res, next) => {
    try {
        const cliente = await Cliente.findOne({ id: Number(req.params.id) });
        if (!cliente) {
            const error = new Error(`No se encontró el cliente ${req.params.id}.`);
            error.statusCode = 404;
            throw error;
        }
        res.json(cliente);
    } catch (error) {
        next(error);
    }
};

export const crearCliente = async (req, res, next) => {
    try {
        
        const nuevoCliente = new Cliente(req.body);
        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    } catch (error) {
        next(error);
    }
};

export const actualizarCliente = async (req, res, next) => {
    try {
        const clienteActualizado = await Cliente.findOneAndUpdate(
            { id: Number(req.params.id) },
            req.body,
            { returnDocument: 'after', runValidators: true }
        );
        if (!clienteActualizado) {
            const error = new Error(`No se encontró el cliente ${req.params.id} para actualizar.`);
            error.statusCode = 404;
            throw error;
        }
        res.json(clienteActualizado);
    } catch (error) {
        next(error);
    }
};

export const eliminarCliente = async (req, res, next) => {
    try {
        const clienteEliminado = await Cliente.findOneAndDelete({ id: Number(req.params.id) });
        if (!clienteEliminado) {
            const error = new Error(`No se encontró el cliente ${req.params.id} para eliminar.`);
            error.statusCode = 404;
            throw error;
        }
        res.json(clienteEliminado);
    } catch (error) {
        next(error);
    }
};