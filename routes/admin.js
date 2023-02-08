// ! Aqui serão guardadas as rotas de Admin.

const express = require('express') // vou chamar o express.
const routes = express.Router() // o routes vai receber o express.Router()

// Rota principal painel Admin.

routes.get('/', (req, res) => {
    res.send('Página principal do painel ADM')
})

// Rota que vai listar posts

routes.get('/posts', (req, res) => {
    res.send('Página de posts')
})

// Rota de categorias

routes.get('/category', (req, res) => {
    res.send('Página de categorias')
})

module.exports = routes // vou exportar as rotas