'use strict';

const useragent = require('useragent');
const servicoAutenticacao = require('../servicos/servico-autenticacao');
const repositorioRegistroAcesso = require('../repositorios/repositorio-registro-acesso');
const enumAcesso = require('../enumeradores/enum-acesso');

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

    let usuarioCriador = await servicoAutenticacao.idUsuarioToken(req);
    if (!usuarioCriador) {
        usuarioCriador = global.ID_USUARIO_GERAL;
    }
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

    await repositorioRegistroAcesso.padrao().criar(novo);
};

exports.cadastrarRegistro = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcesso.registro);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro de criar usuário sistema.',
            msgErro: e
        });
    }
};

exports.cadastrarAcessoEmail = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcesso.email);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro da autenticação do usuário.',
            msgErro: e
        });
    }
};

exports.cadastrarAtualizar = async (req, res, next) => {
    try {
        await criarRegistro(req, res, next, enumAcesso.atualizar);
        next();
    }
    catch (e) {
        res.status(500).send({
            msg: 'Falha no registro de atualizaçῶao de token.',
            msgErro: e
        });
    }
};
