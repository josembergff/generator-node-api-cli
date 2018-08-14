'use strict';

const useragent = require('useragent');
const servicoAutenticacao = require('../servicos/servico-autenticacao');
const enumAcoes = require('../enumeradores/enum-acoes');
const repositorioRegistroCrud = require('../repositorios/repositorio-registro-crud');

const unirRequisicao = async (req) => {
    let retorno = {};
    retorno = Object.assign(retorno, req.params);
    retorno = Object.assign(retorno, req.body);
    return retorno;
};

const prepararRequisicao = async (req) => {
    let ipUsuario = "::1";

    const navegadorUsuario = useragent.is(req.headers['user-agent']);

    if (req && req.connection && req.connection.remoteAddress && req.connection.remoteAddress.replace) {
        ipUsuario = req.connection.remoteAddress.replace("::ffff:", "");
    }
    const usuarioCriador = await servicoAutenticacao.idUsuarioToken(req);
    const objetoRegistro = await unirRequisicao(req);
    const urls = req.baseUrl.split('/');
    const nomeModelo = urls[1];
    const retorno = {
        modelo: nomeModelo,
        navegador: navegadorUsuario,
        ip: ipUsuario,
        criador: usuarioCriador,
        registro: objetoRegistro
    };
    return retorno;
};

const criarRegistro = async (req, res, next, acao) => {
    const novo = await prepararRequisicao(req);
    novo.acao = acao;
    await repositorioRegistroCrud.padrao().criar(novo);
};

exports.cadastrarCriacao = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.criacao);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registrar a criação.',
            msgErro: e
        });
    }
};

exports.cadastrarEdicao = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.edicao);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro de edição.'
        });
    }
};

exports.cadastrarExclusao = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.exclusao);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro da exclusão.',
            msgErro: e
        });
    }
};

exports.cadastrarStatus = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.alteracaoStatus);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro da alteração de status.',
            msgErro: e
        });
    }
};

exports.cadastrarIniciar = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.iniciar);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro de inicio.',
            msgErro: e
        });
    }
};

exports.cadastrarPausar = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.pausar);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro de pausa.',
            msgErro: e
        });
    }
};

exports.cadastrarFinalizar = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.finalizar);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro da finalização.',
            msgErro: e
        });
    }
};

exports.cadastrarConcluir = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcoes.concluir);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro da conclusão.',
            msgErro: e
        });
    }
};

