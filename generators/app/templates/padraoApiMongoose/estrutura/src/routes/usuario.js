const autenticacao = require('../services/autenticacao');
const registroAcessoCtrl = require('../controllers/registroAcesso');
const usuarioCtrl = require('../controllers/usuario');

module.exports = app => {
  app
    .route('/usuarios')
    .post(
      autenticacao.linguagem,
      registroAcessoCtrl.cadastrarRegistro,
      usuarioCtrl.cadastrar
    );
  app
    .route('/usuarios/autenticar')
    .post(
      autenticacao.linguagem,
      registroAcessoCtrl.cadastrarAcessoEmail,
      usuarioCtrl.autenticar
    );
  app
    .route('/usuarios/atualizar')
    .post(
      autenticacao.autorizar,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.atualizarToken
    );
  app
    .route('/usuarios/recuperar')
    .put(
      autenticacao.linguagem,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.recuperar
    );
  app
    .route('/usuarios/login/atualizar')
    .put(
      autenticacao.autorizar,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.atualizarSenha
    );
  app
    .route('/usuarios/login/atualizarDispositivo')
    .put(
      autenticacao.autorizar,
      registroAcessoCtrl.cadastrarAtualizar,
      usuarioCtrl.atualizarDispositivo
    );
  app
    .route('/usuarios/busca/:nome')
    .get(autenticacao.autorizar, usuarioCtrl.buscarPorNome);
  app
    .route('/usuarios/dados/usuariosOnline')
    .get(autenticacao.autorizar, usuarioCtrl.usuariosOnline);
  app
    .route('/usuarios/dados/usuarios')
    .get(autenticacao.autorizar, usuarioCtrl.todosUsuarios);
};
