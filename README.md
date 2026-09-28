# Backend Project

Estructura base de un proyecto backend con Node.js + Express.

## Estructura de carpetas

```
backend-project/
├── src/
│   ├── config/         # Configuración (DB, variables, etc.)
│   ├── controllers/    # Manejo de request/response
│   ├── middlewares/    # Middlewares (auth, manejo de errores, etc.)
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas/endpoints
│   ├── services/       # Lógica de negocio
│   ├── utils/          # Funciones utilitarias
│   ├── validators/     # Validación de datos de entrada
│   ├── app.js          # Configuración de la app Express
│   └── server.js       # Punto de entrada
├── tests/
│   ├── unit/
│   └── integration/
├── logs/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación

```bash
npm install
cp .env.example .env
```

## Ejecución

```bash
npm run dev    # modo desarrollo (con nodemon)
npm start      # modo producción
```

## Tests

```bash
npm test
```
## .env
PORT=3008
DB_PATH=./database/trailerflix.json
