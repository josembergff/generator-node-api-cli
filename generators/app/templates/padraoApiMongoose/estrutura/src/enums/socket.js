const modules = require('../config/modules');

module.exports = {
  Conectado: modules.i18n.__('ENUM').SOCKET.CONECTADO,
  Desconectado: modules.i18n.__('ENUM').SOCKET.DESCONECTADO,
  NovaMensagemAtual: modules.i18n.__('ENUM').SOCKET.NOVA_MENSAGEM_ATUAL,
  NovaMensagem: modules.i18n.__('ENUM').SOCKET.NOVA_MENSAGEM,
  Notificacao: modules.i18n.__('ENUM').SOCKET.NOTIFICACAO
};
