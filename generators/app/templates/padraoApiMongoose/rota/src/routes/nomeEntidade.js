const autenticacao = require('../services/autenticacao');
const registroCrudCtrl = require('../controllers/registroCrud');
const grupoCtrl = require('../controllers/grupo');

module.exports = app => {
  app
    .route('/<%=nomeEntidade%>')
    .post(
      autenticacao.autorizar,
      registroCrudCtrl.cadastrarCriacao,
      grupoCtrl.cadastrar
    );
  app
    .route('/<%=nomeEntidade%>/:id')
    .put(
      autenticacao.autorizar,
      registroCrudCtrl.cadastrarEdicao,
      grupoCtrl.editar
    );
  app
    .route('/<%=nomeEntidade%>/:id')
    .delete(
      autenticacao.autorizar,
      registroCrudCtrl.cadastrarExclusao,
      grupoCtrl.excluir
    );

  app.route('/<%=nomeEntidade%>').get(autenticacao.autorizar, grupoCtrl.listar);
  app
    .route('/<%=nomeEntidade%>/dados/combo')
    .get(autenticacao.autorizar, grupoCtrl.combo);
  app
    .route('/<%=nomeEntidade%>/:id')
    .get(autenticacao.autorizar, grupoCtrl.buscarId);
  app
    .route('/<%=nomeEntidade%>/dados/quantidade')
    .get(autenticacao.autorizar, grupoCtrl.quantidadeLista);
};
