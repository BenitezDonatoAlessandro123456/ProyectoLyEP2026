import express from 'express';
import cors from 'cors';
import clientesRouter from './routers/clientes.router.js'; // 1. Importas el router
import { errorHandler } from './middleware/errorHandler.js'; // 2. Importas el manejador de errores

export function crearApp() {
  const app = express();

  const origenes = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
  app.use(cors({ origin: origenes }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', servicio: 'panel-clientes-server' });
  });

  // 3. Montar las rutas de clientes (Esta línea arregla tu error 404)
  app.use('/api/clientes', clientesRouter);

  // 4. Ruta 404 genérica (ya existía)
  app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

  // 5. Manejador de errores centralizado
  app.use(errorHandler);

  return app;
}