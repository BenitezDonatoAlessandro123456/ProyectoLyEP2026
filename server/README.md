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
npm run dev            # arranca con --watch en http://localhost:3001
```

El frontend (`client/`) corre aparte en `http://localhost:5173`.

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm start` | Arranca el servidor (modo producción). |
| `npm run dev` | Arranca con recarga automática. |
| `npm run seed` | Carga 10 clientes de ejemplo en la base (ver "Carga de datos de ejemplo"). |
| `npm test` | Corre las pruebas automatizadas con Vitest. |

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (por defecto 3001). |
| `MONGODB_URI` | Cadena de conexión a MongoDB. **Secreta.** |
| `MONGODB_USERNAME` / `MONGODB_PASSWORD` | Alternativa por partes. **Secretas.** |
| `CORS_ORIGIN` | `http://localhost:5173` en dev, o lista de orígenes separados por coma. |

> El `.env` real nunca se versiona. `MONGODB_URI` contiene credenciales.

## API

Rutas montadas en `/api/clientes`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check (200 aunque Mongo no responda). |
| GET | `/api/clientes` | Lista de clientes. |
| GET | `/api/clientes/:id` | Un cliente (404 si no existe). |
| POST | `/api/clientes` | Alta, con validación de nombre, apellido y formato de email. |
| PUT | `/api/clientes/:id` | Modificación con cambios parciales, sin perder los demás datos. |
| DELETE | `/api/clientes/:id` | Baja. |

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

### Validaciones y errores

| Código | Cuándo |
|--------|--------|
| 200 / 201 | Operación correcta (201 en el alta). |
| 400 | Datos inválidos: falta email, nombre o apellido, formato de email incorrecto o email repetido. |
| 404 | El cliente no existe, o la ruta no existe. |
| 500 | Error interno del servidor. |

Los errores se responden como `{ "error": "mensaje" }` desde un manejador centralizado (`middleware/errorHandler.js`).

## Carga de datos de ejemplo

```bash
npm run seed
```

El script `seeds/seedClientes.js`:

- Crea **10 clientes ficticios** con ids del 1 al 10.
- Usa una contraseña de ejemplo (`ejemplo-no-real`) porque el campo es obligatorio. El login con bcrypt y JWT queda para la fase siguiente.
- **Borra todos los clientes existentes** y reinicia el contador de ids antes de cargar. No lo ejecutes sobre una base con datos que quieras conservar.

## Pruebas automatizadas

```bash
npm test
```

Se usan **Vitest** y **Supertest** sobre una base **MongoDB en memoria** (`mongodb-memory-server`), por lo que las pruebas **no tocan los datos de Atlas**. La primera ejecución descarga un binario de MongoDB y necesita internet.

Las 14 pruebas, en `tests/clientes.test.js`, cubren:

- `GET /api/health` responde 200.
- Listado, y consulta por id existente (200) e inexistente (404).
- Alta válida (201, con id numérico) y alta inválida (400): falta email, nombre o apellido, email con formato incorrecto y email repetido.
- Modificación parcial sin perder los demás datos, y 404 si no existe.
- Baja y posterior 404.
- Ninguna respuesta incluye la contraseña.

## Estructura

```
app.js                 Configuración de Express (middlewares, /health, rutas)
index.js               Arranque: carga .env, conecta a Mongo y escucha
config/db.js           Conexión a MongoDB
models/                Esquemas de Mongoose (Cliente, Counter)
controllers/           Handlers HTTP
routers/               Definición de rutas
middleware/            Manejador central de errores
seeds/                 Script de carga de datos de ejemplo
tests/                 Pruebas automatizadas (Vitest + Supertest)
documents/             Reservado para documentos de datos
```

## Trabajo en equipo

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md): cada integrante trabaja en su rama y cada PR cumple 3 criterios
obligatorios: descripción completa (qué, cómo, archivos), título descriptivo y declaratoria de uso de IA.