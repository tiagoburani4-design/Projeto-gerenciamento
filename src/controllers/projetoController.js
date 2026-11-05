const Projeto = require('../models/Projeto');

const texto = (v) => typeof v === 'string' && v.trim() !== '';
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /projetos  (?nome=  ?tarefa=)
exports.listar = async (req, res, next) => {
  try {
    const filtro = {};
    if (texto(req.query.nome)) {
      filtro.nome = { $regex: escapar(req.query.nome.trim()), $options: 'i' };
    }
    if (texto(req.query.tarefa)) {
      filtro['tarefas.codigo'] = req.query.tarefa.trim();
    }
    const projetos = await Projeto.find(filtro).select('-_id').lean();
    res.status(200).json(projetos);
  } catch (e) { next(e); }
};

// GET /projetos/:codigo
exports.buscar = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo }).select('-_id').lean();
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.status(200).json(projeto);
  } catch (e) { next(e); }
};

// GET /projetos/:codigo/resumo
exports.resumo = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo }).lean();
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.status(200).json({
      codigo: projeto.codigo,
      nome: projeto.nome,
      totalTarefas: projeto.tarefas.length,
      responsaveis: [...new Set(projeto.tarefas.map((t) => t.responsavel))]
    });
  } catch (e) { next(e); }
};

// POST /projetos
exports.criar = async (req, res, next) => {
  try {
    const { codigo, nome, tarefas } = req.body || {};
    if (!texto(codigo)) return res.status(400).json({ erro: 'O campo codigo é obrigatório' });
    if (!texto(nome)) return res.status(400).json({ erro: 'O campo nome é obrigatório' });

    let listaTarefas = [];
    if (tarefas !== undefined) {
      if (!Array.isArray(tarefas)) return res.status(400).json({ erro: 'O campo tarefas deve ser uma lista' });
      const codigos = new Set();
      for (const t of tarefas) {
        if (!t || !texto(t.codigo) || !texto(t.nome) || !texto(t.responsavel)) {
          return res.status(400).json({ erro: 'Toda tarefa deve ter codigo, nome e responsavel' });
        }
        if (codigos.has(t.codigo.trim())) {
          return res.status(409).json({ erro: 'Tarefas com códigos repetidos no mesmo projeto' });
        }
        codigos.add(t.codigo.trim());
      }
      listaTarefas = tarefas;
    }

    const existe = await Projeto.exists({ codigo: codigo.trim() });
    if (existe) return res.status(409).json({ erro: 'Projeto duplicado: já existe um projeto com esse código' });

    const novo = await Projeto.create({ codigo, nome, tarefas: listaTarefas });
    const { _id, ...dados } = novo.toObject();
    res.status(201).json(dados);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ erro: 'Projeto duplicado: já existe um projeto com esse código' });
    next(e);
  }
};

// PUT /projetos/:codigo  (só o nome)
exports.atualizar = async (req, res, next) => {
  try {
    const { nome } = req.body || {};
    const existe = await Projeto.exists({ codigo: req.params.codigo });
    if (!existe) return res.status(404).json({ erro: 'Projeto não encontrado' });
    if (!texto(nome)) return res.status(400).json({ erro: 'O campo nome é obrigatório' });

    const projeto = await Projeto.findOneAndUpdate(
      { codigo: req.params.codigo },
      { $set: { nome: nome.trim() } },
      { new: true }
    ).select('-_id').lean();
    res.status(200).json(projeto);
  } catch (e) { next(e); }
};

// DELETE /projetos/:codigo
exports.excluir = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOneAndDelete({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.status(200).json({ mensagem: 'Projeto excluído com sucesso', codigo: projeto.codigo });
  } catch (e) { next(e); }
};
