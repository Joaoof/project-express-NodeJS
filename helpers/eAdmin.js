module.exports = {
  eAdmin: function(req, res, next){

    if(req.isAuthenticated() && req.user.eAdmin == 1){
      return next();
    } // serve pra verificar se um certo usuário está conectado

    req.flash("error_msg", "Você precisa ser admin  ")
    res.redirect("/")

  }
}