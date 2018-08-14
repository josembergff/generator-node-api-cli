'use strict';

const repositorioGenerico = require('./repositorio-generico');

const padrao = () => {
    repositorioGenerico.modelo('RegistroAcesso');
    return repositorioGenerico;
};

const modelo = () => {
    return repositorioGenerico.modelo('RegistroAcesso');
};

exports.padrao = padrao;