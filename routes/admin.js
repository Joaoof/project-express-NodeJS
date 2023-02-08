// ! Aqui serão guardadas as rotas de Admin.

const express = require('express') // vou chamar o express.
const routes = express.Router() // o routes vai receber o express.Router()
const mongoose = require('mongoose')
require('../models/Categoria') // a gente vai pegar o mdel, com o Categoria dentro
const Categoria = mongoose.model("categorias")
// Rota principal painel Admin.

routes.get('/', (req, res) => {
    res.render('admin/index')
})

// Rota que vai listar posts

routes.get('/posts', (req, res) => {
    res.send('Página de posts')
})

// Rota de categorias

routes.get('/category', (req, res) => {
    res.render('admin/categorias')
})

routes.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

routes.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("Categoria salva com sucesso")
    })
})

module.exports = routes // vou exportar as rotas