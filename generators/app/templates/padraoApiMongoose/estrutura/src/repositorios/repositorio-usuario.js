'use strict';

const repositorioGenerico = require('./repositorio-generico');
const padrao = () => {
    repositorioGenerico.modelo('Usuario');
    return repositorioGenerico;
};

const modelo = () => {
    return repositorioGenerico.modelo('Usuario');
};

exports.padrao = padrao;

exports.buscarEmail = async (email) => {
    const objeto = await padrao().buscar({ email: email });
    return objeto;
};

exports.buscarAutenticacao = async (email, senha) => {
    const objeto = await padrao().buscar({
        email: email,
        senha: senha
    });
    return objeto;
};