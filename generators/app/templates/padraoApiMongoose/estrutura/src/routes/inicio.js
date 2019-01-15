const modules = require('../config/modules');
const autenticacao = require('../services/autenticacao');

module.exports = app => {
  const momentoAtual = modules.moment();

  app.route('/').get(autenticacao.linguagem, async (req, res, next) => {
    res.status(200).send({
      api: res.__('SISTEMA').RODANDO,
      online: momentoAtual.fromNow()
    });
  });
};
