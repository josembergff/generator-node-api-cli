'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect(config.conexaoMongo);

// Carrega os Models
const Usuario = require('./modelos/usuario');
const RegistroCrud = require('./modelos/registroCrud');
const RegistroEmail = require('./modelos/registroEmail');
const RegistroAcesso = require('./modelos/registroAcesso');

// Carrega as Rotas
const rotaInicio = require('./rotas/rota-inicial');
app.use('/', rotaInicio);
const rotaUsuario = require('./rotas/rota-usuario');
app.use('/usuarios', rotaUsuario);

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, <%= nomeProjeto %>-acesso-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

module.exports = app;