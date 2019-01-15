const modules = require("../config/modules");
const parameters = require("../config/parameters");
const autenticacao = require("../services/autenticacao");
const registroAcesso = require("../repositories/registroAcesso");
const acessoEnum = require("../enums/acesso");

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
  let usuarioCriador = await autenticacao.idUsuarioToken(req);
  if (!usuarioCriador) {
    usuarioCriador = parameters.idUsuarioGeral;
  }
  const objetoRegistro = await unirRequisicao(req);
  const urls = req.route.path.split("/");
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

  await registroAcesso.padrao().criar(novo);
};
module.exports = {
  cadastrarRegistro: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acessoEnum.registro);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro de criar usuário sistema.",
        msgErro: e
      });
    }
  },

  cadastrarAcessoEmail: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acessoEnum.email);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro da autenticação do usuário.",
        msgErro: e
      });
    }
  },

  cadastrarAtualizar: async (req, res, next) => {
    try {
      await criarRegistro(req, res, next, acessoEnum.atualizar);
      next();
    } catch (e) {
      res.status(500).send({
        msg: "Falha no registro de atualizaçῶao de token.",
        msgErro: e
      });
    }
  }
};
