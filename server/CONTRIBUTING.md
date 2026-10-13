# Asignacion de reparto del backend

Estos documentos reparten el trabajo del backend en unidades independientes.
Cada integrante toma una tarea, trabaja en **su** rama `feature/*` y abre un Pull Request.

## Flujo de trabajo

1. Sincronizar `main`: `git checkout main && git pull`.
2. Crear la rama personal: `git checkout -b feature/<NOMBRE-APELLIDO>`.
3. Implementar según los criterios de aceptación.
4. Commits convencionales (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
5. Abrir un Pull Request hacia `main` cumpliendo los 3 criterios obligatorios.

## Reglas y convenciones

### Nombres de rama

- La rama se identifica con el **nombre y apellido del integrante**, pegados y en 
mayúsculas, sin espacios, sin tildes y sin guiones:

  ```
  feature/JHONDOE
  ```

- Si un integrante toma **más de una tarea asignada**, se agrega un sufijo con el tema 
para distinguirlas:

  ```
  feature/JHONDOE-crud
  feature/JHONDOE-tests
  ```

### Criterios obligatorios de cada Pull Request

Todo PR debe cumplir los **3 criterios**:

1. **Descripción completa**: qué se hace, cómo se hace y archivos modificados.
2. **Título con referencia**: referencia al issue cuando el trabajo se registra en
   issues (por ejemplo `feat(#12): CRUD de clientes`). Si el proyecto no usa issues,
   el título describe la unidad de trabajo (`feat: CRUD de clientes`).
3. **Declaratoria de uso de IA**: herramienta usada, tipo de asistencia y evaluación.

### Plantilla de Pull Request

> Copiar y completar. Cumple los 3 criterios obligatorios.

````markdown
## Descripción

**Qué se hace**: <qué resuelve este PR>
**Cómo se hace**: <enfoque/decisiones técnicas>
**Archivos modificados**:
- `ruta/archivo` — <qué cambia>

## Declaratoria de uso de IA

- **Herramienta**: <nombre y versión de la herramienta>
- **Asistencia**: generación de código / revisión / debugging / documentación
- **Evaluación**: <cómo el integrante revisó, entendió y validó el resultado>
````

## Reglas del código

- No romper el contrato de la API (rutas y shape JSON). El frontend está en producción.
- No versionar `.env`. Usar `.env.example` como referencia.
- Una tarea asignada por PR.