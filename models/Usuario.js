const mongoose = require("mongoose")
const Schema = mongoose.Schema

// QUERO QUE USUARIO TENHA EMAIL E SENHA

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    eAdmin: { // CAMPO QUE IRÁ VERFICAR SE O USUARIO E ADM.
        type: Number,
        default: 0 // QUANDO O CAMPO FOR = 0 NÃO É ADM, QUANDO FOR = 1 É ADM.
    },

    senha: {
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario)