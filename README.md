# Projeto Gerenciamento – API de Projetos e Tarefas

API REST com Node.js, Express e MongoDB (Mongoose).

## Requisitos
- Node.js 18+
- MongoDB local ou MongoDB Atlas

## Instalação
```bash
npm install
cp .env.example .env     # no Windows: copy .env.example .env
```
Edite o `.env` com a sua string de conexão (nunca envie o `.env` ao GitHub):
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/gerenciamento
```

## Popular o banco (3 projetos iniciais)
```bash
npm run seed
```

## Executar
```bash
npm start
```
A API sobe em `http://localhost:3000`.

## Endpoints
| Método | Rota | Descrição |
|---|---|---|
| GET | /projetos | Lista projetos (`?nome=` busca parcial, `?tarefa=` filtra por tarefa) |
| GET | /projetos/:codigo | Busca um projeto |
| GET | /projetos/:codigo/tarefas | Lista tarefas do projeto |
| GET | /projetos/:codigo/resumo | Total de tarefas e responsáveis sem repetição |
| POST | /projetos | Cadastra projeto |
| PUT | /projetos/:codigo | Atualiza o nome |
| DELETE | /projetos/:codigo | Exclui projeto e tarefas |
| POST | /projetos/:codigo/tarefas | Adiciona tarefa |
| PUT | /projetos/:codigo/tarefas/:codigoTarefa | Atualiza nome e responsável |
| DELETE | /projetos/:codigo/tarefas/:codigoTarefa | Remove a tarefa |

Códigos HTTP: 200, 201, 400 (campo obrigatório), 404 (não encontrado), 409 (duplicidade).

## Evidências
Prints dos testes em `evidencias/sucesso` e `evidencias/erros`.
