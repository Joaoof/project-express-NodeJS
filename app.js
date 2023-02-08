// Carregando módulos

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
//const mongoose = require('mongoose')

// * Configurações

// Configurando Body-Parser

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Configurando Handlebars

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Configurando mongoose

// Em breve


// ! Rotas

// Outros
const PORT = 8082 // Variavel da porta
app.listen(PORT, () =>{
    console.log("Porta conectada")
}) // Porta em que vou acessar meu site, vou passar também uma função de call back, onde ela vai me dizer se estou conectado a porta!