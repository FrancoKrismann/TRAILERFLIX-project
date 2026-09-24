// Configuración de conexión a la base de datos.
// Ajustar según el motor a utilizar (PostgreSQL, MongoDB, MySQL, etc.)

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydatabase',
};
