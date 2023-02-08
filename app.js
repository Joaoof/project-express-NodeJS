// Carregando módulos

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin') // pra poder passa as rotas eu tive que criar essa variavel
const path = require('path')
const mongoose = require('mongoose')

// * Configurações

// Configurando Body-Parser

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Configurando Handlebars

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

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
    res.send('Rota principal')
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