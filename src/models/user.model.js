// Definición del modelo de datos "User".
// Adaptar según el ORM/ODM utilizado (Sequelize, Mongoose, Prisma, etc.)

class User {
  constructor({ id, name, email }) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

module.exports = User;
