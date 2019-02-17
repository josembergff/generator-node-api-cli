const autenticacao = require('../services/autenticacao');
const registroAcessoCtrl = require('../controllers/registroAcesso');
const usuarioCtrl = require('../controllers/usuario');

module.exports = app => {
  app
    .route('/usuario')
    .post(
      autenticacao.linguagem,
      registroAcessoCtrl.cadastrarRegistro,
      usuarioCtrl.cadastrar
    );
  app
    .route('/usuario/autenticar')
    .post(
      autenticacao.linguagem,
      registroAcessoCtrl.cadastrarAcessoEmail,
      usuarioCtrl.autenticar
    );
  app
    .route('/usuario/atualizar')
    .post(
      autenticacao.autorizar,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.atualizarToken
    );
  app
    .route('/usuario/recuperar')
    .put(
      autenticacao.linguagem,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.recuperar
    );
  app
    .route('/usuario/login/atualizar')
    .put(
      autenticacao.autorizar,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.atualizarSenha
    );
  app
    .route('/usuario/login/atualizarDispositivo')
    .put(
      autenticacao.autorizar,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.atualizarDispositivo
    );
  app
    .route('/usuario/busca/:nome')
    .get(autenticacao.autorizar, usuarioCtrl.buscarPorNome);
  app
    .route('/usuario/dados/usuariosOnline')
    .get(autenticacao.autorizar, usuarioCtrl.usuariosOnline);
  app
    .route('/usuario/dados/usuarios')
    .get(autenticacao.autorizar, usuarioCtrl.todosUsuarios);
};
