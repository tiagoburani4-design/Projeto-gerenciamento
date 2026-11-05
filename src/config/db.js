const mongoose = require('mongoose');

async function conectar() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não definida. Crie o arquivo .env a partir do .env.example');
  }
  await mongoose.connect(uri);
  console.log('MongoDB conectado');
}

module.exports = conectar;
