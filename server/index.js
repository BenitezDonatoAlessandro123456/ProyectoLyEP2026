import 'dotenv/config';
import { crearApp } from './app.js';

const PORT = process.env.PORT || 3001;

// La conexión a MongoDB Atlas se agrega en la rama de modelos y base de datos
crearApp().listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});