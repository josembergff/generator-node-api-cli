'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const enumEmail = require('../enumeradores/enum-email');
const lodash = require('lodash');

const schema = new Schema({
    email: {
        type: String,
        required: [true, 'O nome do Email é obrigatório'],
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
        enum: lodash.values(enumEmail),
        trim: true
    },
    enviado: {
        type: Boolean,
        required: true,
        default: true
    },
    criacao: {
        type: Date,
        required: true,
        default: Date.now
    },
    registro: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Obrigatório o email do registro.']
    },
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }
});

module.exports = mongoose.model('RegistroEmail', schema);
