const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var error = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        error.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        error.push({texto: "Email inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        error.push({texto: "Senha inválido"})
    }

    if(req.body.senha.length < 5){
        error.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        error.push({texto: "A senha está diferente, tente novamente"})
    }

    if(error.length > 0){

        res.render("usuarios/registro", {error: error})

    }else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com este email no nosso sistema")
                res.redirect("/usuarios/registro")
            }else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (error, hash) => {
                        if(error) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso")
                            res.redirect("/")
                        }).catch((error) => {
                            req.flash("Houve um erro ao criar usuário, tente novamente")
                            res.redirect("/usuarios/registro")
                        })

                    })
                })
            
            }

        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next) // sempre que eu quiser sutenticar algo,eu utilizo isso
})

module.exports = router