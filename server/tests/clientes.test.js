import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { crearApp } from '../app.js';
import Cliente from '../models/Cliente.js';
import Counter from '../models/Counter.js';

const app = crearApp();
let mongo;

const clienteValido = {
  email: 'ana@ejemplo.com',
  username: 'ana',
  password: 'ejemplo-no-real',
  name: { firstname: 'Ana', lastname: 'Gomez' },
  phone: '388-0000000',
};

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Cliente.init(); // crea el indice unico del email
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Cliente.deleteMany({});
  await Counter.deleteMany({});
});

describe('GET /api/health', () => {
  it('responde 200 con status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/clientes', () => {
  it('devuelve la lista de clientes', async () => {
    await Cliente.create(clienteValido);
    const res = await request(app).get('/api/clientes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('GET /api/clientes/:id', () => {
  it('devuelve el cliente si existe', async () => {
    const creado = await Cliente.create(clienteValido);
    const res = await request(app).get(`/api/clientes/${creado.id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('ana@ejemplo.com');
  });

  it('responde 404 si no existe', async () => {
    const res = await request(app).get('/api/clientes/999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/clientes', () => {
  it('crea un cliente valido con id numerico', async () => {
    const res = await request(app).post('/api/clientes').send(clienteValido);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
  });

  it('responde 400 si falta el email', async () => {
    const { email, ...sinEmail } = clienteValido;
    const res = await request(app).post('/api/clientes').send(sinEmail);
    expect(res.status).toBe(400);
  });

  it('responde 400 si el email esta repetido', async () => {
    await request(app).post('/api/clientes').send(clienteValido);
    const res = await request(app).post('/api/clientes').send(clienteValido);
    expect(res.status).toBe(400);
  });

  it('responde 400 si falta el nombre', async () => {
    const { name, ...sinNombre } = clienteValido;
    const res = await request(app).post('/api/clientes').send(sinNombre);
    expect(res.status).toBe(400);
  });

  it('responde 400 si falta el apellido', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .send({ ...clienteValido, name: { firstname: 'Ana' } });
    expect(res.status).toBe(400);
  });

  it('responde 400 si el email tiene formato invalido', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .send({ ...clienteValido, email: 'esto-no-es-un-email' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/clientes/:id', () => {
  it('actualiza un campo sin perder los demas', async () => {
    const creado = await Cliente.create(clienteValido);
    const res = await request(app)
      .put(`/api/clientes/${creado.id}`)
      .send({ phone: '388-1111111' });
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('388-1111111');
    expect(res.body.email).toBe('ana@ejemplo.com');
    expect(res.body.name.firstname).toBe('Ana');
  });

  it('responde 404 si el cliente no existe', async () => {
    const res = await request(app).put('/api/clientes/999').send({ phone: '1' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/clientes/:id', () => {
  it('elimina el cliente y luego da 404', async () => {
    const creado = await Cliente.create(clienteValido);
    const del = await request(app).delete(`/api/clientes/${creado.id}`);
    expect(del.status).toBe(200);
    const get = await request(app).get(`/api/clientes/${creado.id}`);
    expect(get.status).toBe(404);
  });
});

describe('Seguridad', () => {
  it('ninguna respuesta incluye la contrasena', async () => {
    const res = await request(app).post('/api/clientes').send(clienteValido);
    expect(res.body.password).toBeUndefined();
    const lista = await request(app).get('/api/clientes');
    expect(lista.body[0].password).toBeUndefined();
  });
});