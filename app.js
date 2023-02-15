// Carregando módulos

const express = require('express')
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin') // pra poder passa as rotas eu tive que criar essa variavel
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require("connect-flash")
require("./models/Posts")
const Posts = mongoose.model("postagens")

// * Configurações
    // Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true,
        // cookie: {secure: true}
    }))

    app.use(flash())
// Middleware -- Configurando 

    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg') // var global - Posso acessar  em qualquer parte da minha aplicação
        res.locals.error_msg = req.flash('error_msg') // var global
        next()
    })

// Configurando Body-Parser

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Configurando Handlebars

const hbs = exphbs.create({
    defaultLayout: 'main', 
    extname: 'handlebars',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  });


  app.engine('handlebars', hbs.engine); 
  app.set('view engine', 'handlebars');
  app.set('views', 'views');

// Configurando mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogApp').then(() => {
    console.log("Conectado ao mongo")
}).catch((error) => {
    console.log("erro ao se conectar: " +error)
})

// Em breve

// Public - Arquivos estáticos.

app.use(express.static(path.join(__dirname + "/public")))

// ! Rotas

app.get('/', (req, res) => {
    Posts.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })

})

    app.get("/404", (req, res) => {
        res.send("Not Found 404")
    })

app.get('/posts', (req, res) => {
    res.send('Lista de posts')
})

app.use('/admin', admin) // caso eu queira acessar as rotas, devo eu colocar o prefixo 'admin'

// Outros
const PORT = 8082 // Variavel da porta
app.listen(PORT, () =>{
    console.log("Porta conectada")
}) // Porta em que vou acessar meu site, vou passar também uma função de call back, onde ela vai me dizer se estou conectado a porta!