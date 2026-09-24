const result = require('dotenv').config();
const app = require('./app');
console.log(result);//Borrar despues
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
