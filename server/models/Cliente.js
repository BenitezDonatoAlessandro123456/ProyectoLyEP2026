import mongoose from 'mongoose';

import Counter from './Counter.js';

const nombreSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    lastname: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  },
  { _id: false }
);

const geolocalizacionSchema = new mongoose.Schema(
  {
    lat: { type: String, default: '' },
    long: { type: String, default: '' },
  },
  { _id: false }
);

const direccionSchema = new mongoose.Schema(
  {
    city: { type: String, default: '' },
    street: { type: String, default: '' },
    number: { type: Number, default: 0 },
    zipcode: { type: String, default: '' },
    geolocation: { type: geolocalizacionSchema, default: () => ({}) },
  },
  { _id: false }
);

/**
 * Documento Cliente.
 *
 * El shape replica el que ya consume el frontend (drop-in de FakeStoreAPI):
 * id numérico, name, address, phone. `name` y `address` tienen defaults para
 * que el frontend nunca reciba un undefined en `cliente.name.lastname` ni en
 * `cliente.address.city`.
 */
const clienteSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato valido'],
    },
    username: { type: String, required: true, trim: true },
    // select: false -> nunca viaja en las consultas ni en las respuestas.
    password: { type: String, required: true, select: false },
    name: { type: nombreSchema, default: () => ({}) },
    address: { type: direccionSchema, default: () => ({}) },
    phone: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
    // Desactiva el virtual `id` que Mongoose crea sobre _id,
    // para poder usar un id numérico propio.
    id: false,
  }
);

// Asigna el id numérico auto-incremental al crear un cliente nuevo.
clienteSchema.pre('validate', async function preValidate() {
  if (this.isNew && this.id == null) {
    this.id = await Counter.nextSeq('cliente');
  }

});

// La respuesta nunca expone _id ni password.
clienteSchema.set('toJSON', {
  transform(_documento, respuesta) {
    delete respuesta._id;
    delete respuesta.password;
    return respuesta;
  },
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;