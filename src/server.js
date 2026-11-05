require('dotenv').config();
const app = require('./app');
const conectar = require('./config/db');

const PORT = process.env.PORT || 3000;

conectar()
  .then(() => app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Falha ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
