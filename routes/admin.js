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

    var error = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null)  {
        error.push({texto: "Nome inválido"}) 
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        error.push({texto: "Slug inválido"}) 
    }
    
    if(req.body.nome.length <= 5) {
        error.push({texto: "Nome da categoria muito pequeno"})
    }

    if(error.length > 0) {
        res.render("admin/addcategorias", {error: error})
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect("/admin/category")
        }).catch((error) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
            res.redirect("/admin")
        })
        }

})

module.exports = routes // vou exportar as rotas