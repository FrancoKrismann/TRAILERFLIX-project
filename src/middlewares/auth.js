module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // Aquí iría la verificación real del token (JWT, sesión, etc.)
  next();
};
