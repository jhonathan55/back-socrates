# Back Socrates API

Backend en NestJS con enfoque en arquitectura por capas, seguridad y evolucion hacia integracion MCP.

## Stack

- NestJS 11 + TypeScript
- MongoDB + Mongoose
- JWT (access/refresh)
- CASL para RBAC/ABAC
- Swagger para documentacion de API REST

## Ejecutar proyecto

1. Instalar dependencias

```bash
npm install
```

2. Configurar variables de entorno requeridas

- NODE_ENV
- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_ACCESS_EXPIRES_IN
- JWT_REFRESH_SECRET
- JWT_REFRESH_EXPIRES_IN
- BCRYPT_ROUNDS

3. Levantar en desarrollo

```bash
npm run start:dev
```

4. Endpoints utiles

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/docs

## Scripts

- Desarrollo: npm run start:dev
- Produccion: npm run start:prod
- Build: npm run build
- Lint: npm run lint
- Unit tests: npm run test
- E2E tests: npm run test:e2e
- Coverage: npm run test:cov

## Documentacion tecnica

La documentacion detallada vive en [docs/README.md](docs/README.md):

1. [Arquitectura + SOLID + Clean Code](docs/01-architecture-clean-solid.md)
2. [Seguridad OWASP aplicada](docs/02-security-owasp.md)
3. [UX/UI para API (Developer Experience)](docs/03-api-ux-guidelines.md)
4. [Roadmap de integracion MCP](docs/04-mcp-integration-roadmap.md)
5. [Estandares de desarrollo](docs/05-development-standards.md)

## Enfoque del proyecto

1. Dominio desacoplado de framework e infraestructura.
2. Casos de uso como unidad principal de negocio.
3. Seguridad por defecto y control de acceso explicito.
4. Contratos API consistentes para mejorar experiencia de integracion.
5. Preparacion para exponer capacidades por servidor MCP sin acoplar el core.
