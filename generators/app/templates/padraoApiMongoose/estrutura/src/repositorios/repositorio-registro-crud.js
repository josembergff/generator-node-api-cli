'use strict';

const repositorioGenerico = require('./repositorio-generico');
const padrao = () => {
    repositorioGenerico.modelo('RegistroCrud');
    return repositorioGenerico;
};

const modelo = () => {
    return repositorioGenerico.modelo('RegistroCrud');
};

exports.padrao = padrao;