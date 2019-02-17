const autenticacao = require('../services/autenticacao');
const registroCrudCtrl = require('../controllers/registroCrud');
const modules = require('../config/modules');
const <%=nomeEntidade%>Ctrl = require('../controllers/<%=nomeEntidade%>');

module.exports = app => {
  app
    .route('/<%=nomeEntidade%>')
    .post(
      autenticacao.autorizar,
        [
            modules.validation
                .check(
                    'nome',
                    modules.i18n.__('SISTEMA.VALIDACOES.NOME_MINIMO_OBRIGATORIO', {
                        entidade: '<%=nomeExternoEntidade%>'
                    })
                )
                .not()
                .isEmpty()
                .trim()
                .escape()
                .isLength({
                    min: 3
                })
        ],
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
