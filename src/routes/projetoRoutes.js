const express = require('express');
const projetos = require('../controllers/projetoController');
const tarefas = require('../controllers/tarefaController');

const router = express.Router();

router.get('/', projetos.listar);
router.post('/', projetos.criar);

router.get('/:codigo/resumo', projetos.resumo);

router.get('/:codigo/tarefas', tarefas.listar);
router.post('/:codigo/tarefas', tarefas.adicionar);
router.put('/:codigo/tarefas/:codigoTarefa', tarefas.atualizar);
router.delete('/:codigo/tarefas/:codigoTarefa', tarefas.remover);

router.get('/:codigo', projetos.buscar);
router.put('/:codigo', projetos.atualizar);
router.delete('/:codigo', projetos.excluir);

module.exports = router;
