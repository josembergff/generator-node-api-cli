const autenticacao = require('../services/autenticacao');
const registroCrudCtrl = require('../controllers/registroCrud');
const <%=nomeEntidade%>Ctrl = require('../controllers/<%=nomeEntidade%>');
const i18n = require('i18n');

module.exports = app => {
  app
    .route('/<%=nomeEntidade%>')
    .post(
      autenticacao.autorizar,
      registroCrudCtrl.cadastrarCriacao,
      <%=nomeEntidade%>Ctrl.cadastrar
    );
  app
    .route('/<%=nomeEntidade%>/:id')
    .put(
      autenticacao.autorizar,
      registroCrudCtrl.cadastrarEdicao,
      <%=nomeEntidade%>Ctrl.editar
    );
  app
    .route('/<%=nomeEntidade%>/:id')
    .delete(
      autenticacao.autorizar,
      registroCrudCtrl.cadastrarExclusao,
      <%=nomeEntidade%>Ctrl.excluir
    );

  app.route('/<%=nomeEntidade%>').get(autenticacao.autorizar, <%=nomeEntidade%>Ctrl.listar);
  app
    .route('/<%=nomeEntidade%>/dados/combo')
    .get(autenticacao.autorizar, <%=nomeEntidade%>Ctrl.combo);
  app
    .route('/<%=nomeEntidade%>/:id')
    .get(autenticacao.autorizar, <%=nomeEntidade%>Ctrl.buscarId);
  app
    .route('/<%=nomeEntidade%>/dados/quantidade')
    .get(autenticacao.autorizar, <%=nomeEntidade%>Ctrl.quantidadeLista);
};
