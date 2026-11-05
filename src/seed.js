require('dotenv').config();
const mongoose = require('mongoose');
const conectar = require('./config/db');
const Projeto = require('./models/Projeto');

const dados = [
  {
    codigo: 'PRJ001',
    nome: 'Desenvolvimento de Site',
    tarefas: [
      { codigo: 'TAR101', nome: 'Criar layout', responsavel: 'Ana' },
      { codigo: 'TAR102', nome: 'Desenvolver API', responsavel: 'Carlos' },
      { codigo: 'TAR103', nome: 'Testar telas', responsavel: 'Ana' }
    ]
  },
  {
    codigo: 'PRJ002',
    nome: 'Aplicativo Mobile',
    tarefas: [
      { codigo: 'TAR201', nome: 'Prototipar telas', responsavel: 'Beatriz' },
      { codigo: 'TAR202', nome: 'Implementar login', responsavel: 'Diego' }
    ]
  },
  {
    codigo: 'PRJ003',
    nome: 'Migração para Nuvem',
    tarefas: [
      { codigo: 'TAR101', nome: 'Mapear servidores', responsavel: 'Carlos' },
      { codigo: 'TAR302', nome: 'Configurar backups', responsavel: 'Eduarda' }
    ]
  }
];

(async () => {
  await conectar();
  await Projeto.deleteMany({});
  await Projeto.insertMany(dados);
  console.log('Banco populado com', dados.length, 'projetos');
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
