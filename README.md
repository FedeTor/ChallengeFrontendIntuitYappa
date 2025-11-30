# ChallengeFrontendIntuit

Aplicación frontend en Angular para gestionar clientes, con dashboard, búsqueda, formularios y operaciones CRUD contra una API configurable.

## Requisitos previos
- Node.js 18 o superior
- npm
- Angular CLI

## Instalación
```bash
npm install
```

## Desarrollo
Levanta el entorno de desarrollo con servidor de recarga en caliente:
```bash
npm start
```

## Build de producción
Genera los artefactos optimizados en `dist/`:
```bash
npm run build
```

## Estructura básica
```
src/
  app/
    components/       # UI reusable y dashboard de clientes
    services/         # Integración con API de clientes
    models/           # Modelos y DTOs
  environments/       # Configuración de entorno
  styles.css          # Estilos globales
public/               # Activos públicos
angular.json          # Configuración del proyecto Angular
```

## Variables de entorno
Configura la URL base de la API en `src/environments/environment.ts` (propiedad `apiBaseUrl`). Ajusta este valor antes de compilar o desplegar.