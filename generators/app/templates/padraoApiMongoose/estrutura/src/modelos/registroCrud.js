'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const enumAcoes = require('../enumeradores/enum-acoes');

const lodash = require('lodash');

const schema = new Schema({
    modelo: {
        type: String,
        required: [true, 'O nome do Modelo é obrigatório'],
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
    acao: {
        type: String,
        required: [true, 'Obrigatório a ação do registro.'],
        enum: lodash.values(enumAcoes),
        trim: true
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

module.exports = mongoose.model('RegistroCrud', schema);
