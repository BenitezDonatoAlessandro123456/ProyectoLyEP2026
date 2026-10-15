import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDB } from '../config/db.js';
import Cliente from '../models/Cliente.js';
import Counter from '../models/Counter.js';

// Datos 100% ficticios. Contrasena de ejemplo, no real (el login con bcrypt
// queda para la fase siguiente del proyecto).
const PASSWORD_EJEMPLO = 'ejemplo-no-real';

const clientes = [
  { email: 'juan.perez@ejemplo.com', username: 'jperez', firstname: 'Juan', lastname: 'Perez', city: 'San Salvador de Jujuy', street: 'Av. Bolivia', number: 1250, zipcode: '4600', phone: '388-4000001', lat: '-24.1858', long: '-65.2995' },
  { email: 'maria.gomez@ejemplo.com', username: 'mgomez', firstname: 'Maria', lastname: 'Gomez', city: 'Palpala', street: 'Calle Belgrano', number: 340, zipcode: '4612', phone: '388-4000002', lat: '-24.2570', long: '-65.2100' },
  { email: 'carlos.ruiz@ejemplo.com', username: 'cruiz', firstname: 'Carlos', lastname: 'Ruiz', city: 'Salta', street: 'Av. San Martin', number: 875, zipcode: '4400', phone: '387-4000003', lat: '-24.7821', long: '-65.4232' },
  { email: 'laura.diaz@ejemplo.com', username: 'ldiaz', firstname: 'Laura', lastname: 'Diaz', city: 'San Miguel de Tucuman', street: 'Calle Mendoza', number: 120, zipcode: '4000', phone: '381-4000004', lat: '-26.8083', long: '-65.2176' },
  { email: 'pedro.lopez@ejemplo.com', username: 'plopez', firstname: 'Pedro', lastname: 'Lopez', city: 'Perico', street: 'Av. Rivadavia', number: 560, zipcode: '4608', phone: '388-4000005', lat: '-24.3800', long: '-65.1100' },
  { email: 'ana.torres@ejemplo.com', username: 'atorres', firstname: 'Ana', lastname: 'Torres', city: 'Libertador General San Martin', street: 'Calle Sarmiento', number: 98, zipcode: '4512', phone: '3886-400006', lat: '-23.8130', long: '-64.7890' },
  { email: 'diego.vega@ejemplo.com', username: 'dvega', firstname: 'Diego', lastname: 'Vega', city: 'Humahuaca', street: 'Calle Tucuman', number: 45, zipcode: '4630', phone: '388-4000007', lat: '-23.2050', long: '-65.3500' },
  { email: 'sofia.molina@ejemplo.com', username: 'smolina', firstname: 'Sofia', lastname: 'Molina', city: 'Oran', street: 'Av. Pellegrini', number: 710, zipcode: '4530', phone: '3878-400008', lat: '-23.1320', long: '-64.3260' },
  { email: 'martin.castro@ejemplo.com', username: 'mcastro', firstname: 'Martin', lastname: 'Castro', city: 'Tartagal', street: 'Calle Mitre', number: 233, zipcode: '4560', phone: '3875-400009', lat: '-22.5160', long: '-63.8010' },
  { email: 'lucia.herrera@ejemplo.com', username: 'lherrera', firstname: 'Lucia', lastname: 'Herrera', city: 'San Fernando del Valle de Catamarca', street: 'Calle Rivadavia', number: 415, zipcode: '4700', phone: '383-4000010', lat: '-28.4696', long: '-65.7852' },
];

async function seed() {
  await connectDB();

  // connectDB no corta el proceso si falla, asi que verificamos la conexion.
  if (mongoose.connection.readyState !== 1) {
    console.error('No se pudo conectar a MongoDB. Seed cancelado.');
    process.exit(1);
  }

  // Limpia la coleccion y reinicia el contador para que los ids sean 1..10.
  await Cliente.deleteMany({});
  await Counter.deleteOne({ _id: 'cliente' });

  // Se crean de a uno para que el id auto-incremental salga en orden.
  for (const c of clientes) {
    await Cliente.create({
      email: c.email,
      username: c.username,
      password: PASSWORD_EJEMPLO,
      name: { firstname: c.firstname, lastname: c.lastname },
      address: {
        city: c.city,
        street: c.street,
        number: c.number,
        zipcode: c.zipcode,
        geolocation: { lat: c.lat, long: c.long },
      },
      phone: c.phone,
    });
  }

  const total = await Cliente.countDocuments();
  console.log(`Seed completo: ${total} clientes cargados.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Error en el seed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});