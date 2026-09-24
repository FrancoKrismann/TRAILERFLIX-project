// Aquí iría la lógica de negocio y el acceso a datos (a través de los modelos).
// Se usa un arreglo en memoria solo como ejemplo inicial.

let users = [];
let nextId = 1;

exports.getAll = async () => users;

exports.getById = async (id) => users.find((u) => u.id === Number(id));

exports.create = async (data) => {
  const newUser = { id: nextId++, ...data };
  users.push(newUser);
  return newUser;
};

exports.update = async (id, data) => {
  const index = users.findIndex((u) => u.id === Number(id));
  if (index === -1) return null;
  users[index] = { ...users[index], ...data };
  return users[index];
};

exports.remove = async (id) => {
  users = users.filter((u) => u.id !== Number(id));
};
