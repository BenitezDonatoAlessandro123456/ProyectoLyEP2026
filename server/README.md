# ProyectoLyEP2026-server

Backend del Panel de Control de Clientes (LyEP 2026).
Reemplaza la API pública FakeStoreAPI que hoy consume el frontend en producción.

Stack: **Node.js + Express + Mongoose (MongoDB Atlas)**.

## Requisitos

- Node.js >= 20
- Una base MongoDB (Atlas o local)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # completar MONGODB_URI y lo demás
npm run dev            # arranca con --watch en http://localhost:4000
```

Cargar datos de ejemplo:

```bash
npm run seed
```

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm start` | Arranca el servidor (modo producción). |
| `npm run dev` | Arranca con recarga automática. |
| `npm run seed` | Carga `documents/clientes.seed.json` en la base. |

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (Render lo inyecta solo). |
| `MONGODB_URI` | Cadena de conexión a MongoDB. **Secreta.** |
| `MONGODB_USERNAME` / `MONGODB_PASSWORD` | Alternativa por partes. **Secretas.** |
| `CORS_ORIGIN` | `http://localhost:5173` en dev, o lista de orígenes separados por coma. |

> El `.env` real nunca se versiona. `MONGODB_URI` contiene credenciales.

## API

Contrato montado en `/clientes`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check (200 aunque Mongo no responda). |
| GET | `/api/clientes` | Lista de clientes. |
| GET | `/api/clientes/:id` | Un cliente (404 si no existe). |
| POST | `/api/clientes` | Crea un cliente. |
| PUT | `/api/clientes/:id` | Actualiza un cliente. |
| DELETE | `/api/clientes/:id` | Elimina un cliente. |

### Shape del cliente

```json
{
  "id": 1,
  "email": "john@gmail.com",
  "username": "johnd",
  "name": { "firstname": "john", "lastname": "doe" },
  "address": {
    "city": "kilcoole",
    "street": "new road",
    "number": 7682,
    "zipcode": "12926-3874",
    "geolocation": { "lat": "-37.3159", "long": "81.1496" }
  },
  "phone": "1-570-236-7033"
}
```

El `id` es numérico y auto-incremental. Las respuestas nunca incluyen `_id` ni `password`.

## Estructura

```
app.js                 Configuración de Express (middlewares, /health, rutas)
index.js               Arranque: carga .env, conecta a Mongo y escucha
config/db.js           Conexión a MongoDB
models/                Esquemas de Mongoose (Cliente, Counter)
controllers/           Handlers HTTP
services/              Lógica de acceso a datos
routes/                Definición de rutas
middleware/            Errores (404, handler central) y validaciones
utils/                 Helpers (ApiError, asyncHandler)
documents/             Documentos semilla (JSON) para la base
seeds/                 Script de carga de la semilla
```

## Trabajo en equipo

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md): cada tarea se trabaja en una rama
`feature/<NOMBRE-APELLIDO>` del integrante asignado, y cada PR cumple 3 criterios
obligatorios: descripción completa (qué, cómo, archivos), título con referencia al
issue (cuando se usen) y declaratoria de uso de IA.