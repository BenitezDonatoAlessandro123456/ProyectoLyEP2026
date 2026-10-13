import express from 'express';
import cors from 'cors';

export function crearApp() {
  const app = express();

  const origenes = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
  app.use(cors({ origin: origenes }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', servicio: 'panel-clientes-server' });
  });

  // Las rutas de clientes y el manejo de errores se agregan en la rama de la API REST

  app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

  return app;
}