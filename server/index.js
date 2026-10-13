import 'dotenv/config';
import { crearApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3001;

// Se dispara la conexión sin bloquear el arranque:
// /health debe responder igual aunque MongoDB no esté disponible.
connectDB();

// La conexión a MongoDB Atlas se agrega en la rama de modelos y base de datos
crearApp().listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});