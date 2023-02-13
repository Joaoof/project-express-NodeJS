// ! Aqui serão guardadas as rotas de Admin.

const express = require('express'); // vou chamar o express.
const routes = express.Router(); // o routes vai receber o express.Router()
const mongoose = require('mongoose');;
require('../models/Categoria') // a gente vai pegar o mdel, com o Categoria dentro
const Categoria = mongoose.model("categorias");
// Rota principal painel Admin.

routes.get('/', (req, res) => {
    res.render('admin/index');
});

// Rota que vai listar posts

routes.get('/posts', (req, res) => {
    res.send('Página de posts');
});

// Rota de categorias

routes.get('/category', (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => { // Vai listar todas as categorias existentes! 'find()'
        res.render('admin/categorias', {categorias: categorias});
    }).catch((error) => {
        req.flash("error_msg", "Houver um erro ao listar as categorias");
        res.redirect("/admin");
    });
});

routes.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});

routes.post('/categorias/nova', (req, res) => {

    var error = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null)  {
        error.push({texto: "Nome inválido"});
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        error.push({texto: "Slug inválido"}) ;
    };
    
    if(req.body.nome.length <= 5) {
        error.push({texto: "Nome da categoria muito pequeno"})
    };

    if(error.length > 0) {
        res.render("admin/addcategorias", {error: error});
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!');
            res.redirect("/admin/category");
        }).catch((error) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente');
            res.redirect("/admin");
        });
        };

});

routes.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria});
        // Pesquisar pelo id da categoria , ou seja para editar a categoria eu devo achar o id dela, né:? kapa kapa        
    }).catch((error) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/category");
    });
}); // Rota de edição das categorias criadas!

routes.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id: req.body.id}).then(((categoria) => {

        categoria.nome = req.body.nome,
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso');
            res.redirect("/admin/category");
        }).catch((error) => {
            req.flash('error_msg', 'Houve um erro ao editar categoria');
            res.redirect("/admin/category");
        });

 })//.catch = ((error) => {
//         req.flash('error_msg', "Houve um erro ao editar a categoria");
//         res.redirect("/admin/category");
   // })
    )

})

routes.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect("/admin/category")

    }).catch((error) => {
        req.flash('error_msg', 'Erro ao deletar categoria')
        res.redirect("/admin/category")
})
})

module.exports = routes; // vou exportar as rotas