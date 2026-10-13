import mongoose from 'mongoose';

/**
 * Conecta a MongoDB usando MONGODB_URI.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI no está definida. Revisá tu archivo .env');
    return;
  }

  try {
    const conexion = await mongoose.connect(uri);
    console.log(`MongoDB conectado: ${conexion.connection.name}`);
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
  }
}

export default connectDB;