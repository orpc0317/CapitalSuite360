# CapitalSuite360

Plataforma SaaS para gestión de ventas y cartera de proyectos de lotificación de terrenos.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |

## Estructura del proyecto

```
CapitalSuite360/
├── client/          # Frontend (React + Vite + Tailwind)
├── server/          # Backend (Node.js + Express)
├── database/        # Scripts SQL del esquema
└── prompts/         # Documentación del proyecto
```

## Configuración inicial

### 1. Base de datos (Supabase)

1. Crear un proyecto en [Supabase](https://supabase.com)
2. En el **SQL Editor**, ejecutar el script `database/01_schema_capitalsuite360.sql`
3. Copiar la **URL del proyecto** y las **claves API** desde *Settings > API*

### 2. Frontend

```bash
cd client
cp .env.example .env
# Editar .env con las credenciales de Supabase
npm run dev
```

### 3. Backend

```bash
cd server
cp .env.example .env
# Editar .env con las credenciales de Supabase
npm run dev
```

## Comandos de desarrollo

| Comando | Descripción |
|---|---|
| `cd client && npm run dev` | Inicia el frontend en http://localhost:5173 |
| `cd server && npm run dev` | Inicia el backend en http://localhost:4000 |

## Versiones

| Versión | Descripción |
|---|---|
| v0.1.0 | Estructura inicial del proyecto + esquema de base de datos |
