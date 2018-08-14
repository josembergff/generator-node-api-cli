'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const enumAcesso = require('../enumeradores/enum-acesso');
const lodash = require('lodash');

const schema = new Schema({
    modelo: {
        type: String,
        required: [true, 'O nome do Modelo é obrigatório'],
        trim: true
    },
    acao: {
        type: String,
        required: [true, 'Obrigatório o tipo de acesso.'],
        enum: lodash.values(enumAcesso),
        trim: true
    },
    navegador: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        trim: true
    },
    ip: {
        type: String,
        required: false,
        trim: false
    },
    criacao: {
        type: Date,
        required: true,
        default: Date.now
    },
    registro: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Obrigatório o objeto do registro.']
    },
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = mongoose.model('RegistroAcesso', schema);
