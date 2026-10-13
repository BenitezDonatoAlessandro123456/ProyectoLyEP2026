import mongoose from 'mongoose';

/**
 * Contador atómico para ids numéricos auto-incrementales.
 * Se guarda un documento por secuencia (por ejemplo "cliente").
 */
const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

/**
 * Devuelve el siguiente número de la secuencia indicada.
 * findByIdAndUpdate con $inc es atómico: dos altas simultáneas
 * nunca obtienen el mismo id.
 */
counterSchema.statics.nextSeq = async function nextSeq(nombre) {
  const contador = await this.findByIdAndUpdate(
    nombre,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return contador.seq;
};

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;