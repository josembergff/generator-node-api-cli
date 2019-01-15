const generic = require("../repositories/generic");
const registroCrud = require("../repositories/registroCrud");
const acoes = require("../enums/acoes");
const modules = require("../config/modules");
const autenticacao = require("../services/autenticacao");

const unirRequisicao = async req => {
  let retorno = {};
  retorno = Object.assign(retorno, req.params);
  retorno = Object.assign(retorno, req.body);
  return retorno;
};

const prepararRequisicao = async req => {
  let ipUsuario = "::1";

  const navegadorUsuario = modules.useragent.is(req.headers["user-agent"]);

  if (
    req &&
    req.connection &&
    req.connection.remoteAddress &&
    req.connection.remoteAddress.replace
  ) {
    ipUsuario = req.connection.remoteAddress.replace("::ffff:", "");
  }
  const usuarioCriador = await autenticacao.idUsuarioToken(req);
  const objetoRegistro = await unirRequisicao(req);
  const urls = req.route.path.split("/");
  const nomeModelo = urls[1];
  let nomeMongoose = letraMaiuscula(nomeModelo);
  nomeMongoose = nomeMongoose.substr(0, nomeMongoose.length - 1);
  const idAtual = objetoRegistro.id || objetoRegistro._id;
  let objetoAtual = {};

  if (idAtual) {
    try {
      generic.modelo(nomeMongoose);
      objetoAtual = await generic.buscarId(idAtual);
    } catch (e) {
      objetoAtual = { erro: e };
    }
  }

  const retorno = {
    modelo: nomeModelo,
    navegador: navegadorUsuario,
    ip: ipUsuario,
    criador: usuarioCriador,
    registro: objetoRegistro,
    registroAtual: objetoAtual
  };
  return retorno;
};

const criarRegistro = async (req, res, next, acao) => {
  const novo = await prepararRequisicao(req);
  novo.acao = acao;
  await registroCrud.padrao().criar(novo);
};

const letraMaiuscula = text => {
  var words = text.toLowerCase().split(" ");
  for (var a = 0; a < words.length; a++) {
    var w = words[a];
    words[a] = w[0].toUpperCase() + w.slice(1);
  }
  return words.join(" ");
};
module.exports = {
  cadastrarCriacao: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.criacao);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registrar a criação.",
        msgErro: e
      });
    }
  },

  cadastrarEdicao: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.edicao);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro de edição."
      });
    }
  },

  cadastrarExclusao: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.exclusao);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro da exclusão.",
        msgErro: e
      });
    }
  },

  cadastrarStatus: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.alteracaoStatus);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro da alteração de status.",
        msgErro: e
      });
    }
  },

  cadastrarIniciar: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.iniciar);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro de inicio.",
        msgErro: e
      });
    }
  },

  cadastrarPausar: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.pausar);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro de pausa.",
        msgErro: e
      });
    }
  },

  cadastrarFinalizar: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.finalizar);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro da finalização.",
        msgErro: e
      });
    }
  },

  cadastrarConcluir: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acoes.concluir);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro da conclusão.",
        msgErro: e
      });
    }
  }
};
