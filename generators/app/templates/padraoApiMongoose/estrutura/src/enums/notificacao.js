const modules = require('../config/modules');

module.exports = {
  BoasVindas: modules.i18n.__('ENUM').NOTIFICACAO.BOAS_VINDAS,
  AtualizacaoSenha: modules.i18n.__('ENUM').NOTIFICACAO.ATUALIZACAO_SENHA,
  AtualizacaoUsuario: modules.i18n.__('ENUM').NOTIFICACAO.ATUALIZACAO_USUARIO,
  ReseteSenha: modules.i18n.__('ENUM').NOTIFICACAO.RESETE_SENHA,
  Cadastro: modules.i18n.__('ENUM').NOTIFICACAO.CADASTRO,
  Exclusao: modules.i18n.__('ENUM').NOTIFICACAO.EXCLUSAO,
  Finalizacao: modules.i18n.__('ENUM').NOTIFICACAO.FINALIZACAO,
  AlteracaoStatus: modules.i18n.__('ENUM').NOTIFICACAO.ALTERACAO_STATUS,
  Edicao: modules.i18n.__('ENUM').NOTIFICACAO.EDICAO,
  NovoDispositivo: modules.i18n.__('ENUM').NOTIFICACAO.NOVO_DISPOSITIVO,
  Frequencia: modules.i18n.__('ENUM').NOTIFICACAO.FREQUENCIA,
  Atrasos: modules.i18n.__('ENUM').NOTIFICACAO.ATRASOS
};
