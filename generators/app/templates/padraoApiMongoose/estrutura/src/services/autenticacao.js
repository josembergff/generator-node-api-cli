const modules = require('../config/modules');
const parameters = require('../config/parameters');
const i18n = require('i18n');

const resgatarUsuarioTokenReq = async req => {
  const token = req.body.ofacessotoken || req.headers[parameters.chaveReq];
  return await resgatarUsuarioToken(token);
};

const resgatarUsuarioToken = async token => {
  if (token) {
    try {
      const data = await modules.jwt.verify(
        token,
        parameters.chavePrivada,
        function(error, decoded) {
          if (error) {
            console.error('Token Inválido', error.message);
            return null;
          } else {
            return decoded;
          }
        }
      );
      return data;
    } catch (erro) {
      console.error('Falha na busca do token atual.', erro);
      return null;
    }
  } else {
    console.error('Token não encontrado na requisição.', token);
    return null;
  }
};

const definirLinguagem = async (req, res, usuario) => {
  let idioma = req.body.linguagem || req.headers['linguagem'];

  if (!usuario) {
    usuario = await resgatarUsuarioTokenReq(req);
  }

  if (usuario && usuario.linguagem) {
    idioma = usuario.linguagem;
  }
  if (idioma) {
    if (idioma.indexOf('-') >= 0) {
      idioma = idioma.split('-')[0];
    }
    i18n.setLocale(idioma);
    res.setLocale(idioma);
  }
};

module.exports = {
  gerarToken: async data => {
    return await modules.jwt.sign(data, parameters.chavePrivada, {
      expiresIn: '365d'
    });
  },

  idUsuarioToken: async req => {
    let usuario = await resgatarUsuarioTokenReq(req);

    if (usuario && usuario._id) {
      return usuario._id;
    } else {
      return null;
    }
  },

  decodificarToken: async req => {
    let usuario = await resgatarUsuarioTokenReq(req);
    return usuario;
  },

  decodificarTokenString: async token => {
    let usuario = await resgatarUsuarioToken(token);
    return usuario;
  },

  autorizar: async (req, res, next) => {
    try {
      let usuario = await resgatarUsuarioTokenReq(req);
      await definirLinguagem(req, res, usuario);
      if (usuario && usuario._id) {
        next();
      } else {
        console.error('Validação de token falhou:', usuario);
        res.status(401).send({
          msg: modules.i18n.__('SERVICO').AUTENTICACAO.TOKEN_INVALIDO
        });
      }
    } catch (e) {
      res.status(401).send({
        msg: modules.i18n.__('SERVICO').AUTENTICACAO.FALHA_TOKEN
      });
      console.error('Validação de token falhou de forma geral:', e);
    }
  },

  administrador: (req, res, next) => {
    var token = req.body.oftoken || req.headers[parameters.chaveReq];

    if (!token) {
      res.status(401).send({
        msg: modules.i18n.__('SERVICO').AUTENTICACAO.TOKEN_INVALIDO
      });
    } else {
      modules.jwt.verify(token, parameters.chavePrivada, function(
        error,
        decoded
      ) {
        if (error) {
          res.status(401).send({
            msg: modules.i18n.__('SERVICO').AUTENTICACAO.TOKEN_INVALIDO
          });
        } else {
          if (decoded.permissoes && decoded.permissoes.includes('admin')) {
            next();
          } else {
            res.status(403).send({
              msg: modules.i18n.__('SERVICO').AUTENTICACAO.SOMENTE_ADM
            });
          }
        }
      });
    }
  },

  linguagem: async (req, res, next) => {
    await definirLinguagem(req, res);
    next();
  }
};
