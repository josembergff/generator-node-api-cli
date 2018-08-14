'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome do Usuário é obrigatório'],
        trim: true
    },
    sobrenome: {
        type: String,
        required: false,
        trim: true
    },
    senha: {
        type: String,
        required: [true, 'A senha do Usuário é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email do Usuário é obrigatório'],
        trim: true,
        unique: true
    },
    foto: {
        type: String,
        required: false,
        trim: true
    },
    ativo: {
        type: Boolean,
        required: true,
        default: true
    },
    atualizar: {
        type: Boolean,
        required: true,
        default: false
    },
    sociais: [{
        type: String,
        required: false
    }],
    criacao: {
        type: Date,
        required: true,
        default: Date.now
    },
    edicao: {
        type: Date,
        required: false
    },
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Usuario', schema);
