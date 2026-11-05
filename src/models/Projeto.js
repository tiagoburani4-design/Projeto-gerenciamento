const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, trim: true },
    nome: { type: String, required: true, trim: true },
    responsavel: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const projetoSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    nome: { type: String, required: true, trim: true },
    tarefas: { type: [tarefaSchema], default: [] }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Projeto', projetoSchema, 'projetos');
