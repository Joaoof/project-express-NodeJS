// ! Aqui serão guardadas as rotas de Admin.

const { Router } = require('express');
const express = require('express'); // vou chamar o express.
const router = express.Router(); // o routes vai receber o express.Router()
const mongoose = require('mongoose');;
require('../models/Categoria') // a gente vai pegar o mdel, com o Categoria dentro
const Categoria = mongoose.model("categorias");
require('../models/Posts')// Vamos pegar o Post dentro do diretorio model.
const Posts = mongoose.model("postagens")

// Rota principal painel Admin.

router.get('/', (req, res) => {
    res.render('admin/index');
});

// Rota que vai listar posts

router.get('/posts', (req, res) => {
    res.send('Página de posts');
});

// Rota de categorias

router.get('/category', (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => { // Vai listar todas as categorias existentes! 'find()'
        res.render('admin/categorias', {categorias: categorias});
    }).catch((error) => {
        req.flash("error_msg", "Houver um erro ao listar as categorias");
        res.redirect("/admin");
    });
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res) => {

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

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria});
        // Pesquisar pelo id da categoria , ou seja para editar a categoria eu devo achar o id dela, né:? kapa kapa        
    }).catch((error) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/category");
    });
}); // Rota de edição das categorias criadas!

router.post("/categorias/edit", (req, res) => {
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

router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect("/admin/category")

    }).catch((error) => {
        req.flash('error_msg', 'Erro ao deletar categoria')
        res.redirect("/admin/category")
})
})

router.get("/postagens", (req, res) => {

    Posts.find().populate("categoria").lean().sort({data: 'desc'}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect('/admin')
    })

})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean(true).then((categoria) => { // Vai passar todas as categorias em view. ou seja tudo!
        res.render("admin/addpostagem", {categoria: categoria})
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
        res.redirect("/admin")
    })
})

// Adicionando categorias ao banco de dados

router.post("/postagens/nova", (req, res) => {
    

    var error = [];

    if(req.body.categoria == '0') {
        error.push({texto: "Informe a categoria"})
    }

    
    if (error.length > 0){
        Categoria.find().lean().then((categoria)=>{
            res.render("admin/addpostagem", {error: error,categoria: categoria})
        }).catch((error)=>{
            res.flash("error_msg","Houve um error ao carregar formulário")
            res.redirect("/admin")
        })
    }else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        
        
    }
    
            new Posts(novaPostagem).save().then(() => {
                req.flash('success_msg', 'Postagem criada com sucesso')
                res.redirect("/admin/postagens")
            }).catch((error) => {
                req.flash('error_msg', 'erro ao criar postagem' + error)
                res.redirect("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", (req, res) => {

    Posts.findOne({_id: req.params.id}).then((postagem) => {

        Categoria.find().lean().then((categoria) => {
            res.render("admin/editpostagens", {categoria: categoria, postagem: postagem})

        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar formulário de edição")
        res.redirect("/admin/postagens")
    })

})

router.post("/postagem/edit", (req, res) => {
    Posts.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((error) => {
            req.flash("error_msg", "Erro interno")
            res.redirect("/admin/postagens")
        })

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao salvar edição")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id", (req, res) => {
    Posts.remove({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/admin/postagens")
    })
})

module.exports = router; // vou exportar as rotas