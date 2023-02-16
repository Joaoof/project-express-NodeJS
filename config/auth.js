const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

// Config Sistema de autenticação

module.exports = function(passport){

  passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {

    Usuario.findOne({email: email}).then((usuario) => {
      if(!usuario){
        return done(null, false, {message: "Esta conta não existe"})
      }
     // Ele vai pesquisar um usuário no email que foi passado qna autenticação acima

    bcrypt.compare(senha, usuario.senha, (error, batem) => {
      if(batem){
        return done(null, usuario)
      }else {
        return done(null, false, {message: "Senha incorreta"})
      }

    })  // Se a conta existir

  })


  })) // Basicamente o campo que quero analisar

  passport.serializeUser((usuario, done) => {

    done(null, usuario.id)

  }) // Salvar dados do usuário em uma sessão

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (error, usuario) => { // A função findById serve para procurar um usuário pelo id dele.
      done(error, usuario)

    })
  })

}