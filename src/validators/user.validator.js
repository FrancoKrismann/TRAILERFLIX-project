exports.validateCreate = (data) => {
  const errors = [];

  if (!data.name) errors.push('El nombre es obligatorio');
  if (!data.email) errors.push('El email es obligatorio');

  return errors;
};
