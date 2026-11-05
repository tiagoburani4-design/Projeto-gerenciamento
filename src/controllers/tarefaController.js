const Projeto = require('../models/Projeto');

const texto = (v) => typeof v === 'string' && v.trim() !== '';

// GET /projetos/:codigo/tarefas
exports.listar = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo }).lean();
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
    res.status(200).json(projeto.tarefas);
  } catch (e) { next(e); }
};

// POST /projetos/:codigo/tarefas
exports.adicionar = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

    const { codigo, nome, responsavel } = req.body || {};
    if (!texto(codigo)) return res.status(400).json({ erro: 'O campo codigo é obrigatório' });
    if (!texto(nome)) return res.status(400).json({ erro: 'O campo nome é obrigatório' });
    if (!texto(responsavel)) return res.status(400).json({ erro: 'O campo responsavel é obrigatório' });

    if (projeto.tarefas.some((t) => t.codigo === codigo.trim())) {
      return res.status(409).json({ erro: 'Tarefa duplicada: esse código já existe neste projeto' });
    }

    projeto.tarefas.push({ codigo, nome, responsavel });
    await projeto.save();
    res.status(201).json(projeto.tarefas[projeto.tarefas.length - 1]);
  } catch (e) { next(e); }
};

// PUT /projetos/:codigo/tarefas/:codigoTarefa
exports.atualizar = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

    const tarefa = projeto.tarefas.find((t) => t.codigo === req.params.codigoTarefa);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    const { nome, responsavel } = req.body || {};
    if (!texto(nome)) return res.status(400).json({ erro: 'O campo nome é obrigatório' });
    if (!texto(responsavel)) return res.status(400).json({ erro: 'O campo responsavel é obrigatório' });

    tarefa.nome = nome.trim();
    tarefa.responsavel = responsavel.trim();
    await projeto.save();
    res.status(200).json(tarefa);
  } catch (e) { next(e); }
};

// DELETE /projetos/:codigo/tarefas/:codigoTarefa
exports.remover = async (req, res, next) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

    const indice = projeto.tarefas.findIndex((t) => t.codigo === req.params.codigoTarefa);
    if (indice === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    projeto.tarefas.splice(indice, 1);
    await projeto.save();
    res.status(200).json({ mensagem: 'Tarefa removida com sucesso', codigoTarefa: req.params.codigoTarefa });
  } catch (e) { next(e); }
};
