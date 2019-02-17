const modules = require('../config/modules');

module.exports = {
  criacao: modules.i18n.__('ENUM').ACOES.CRIACAO,
  edicao: modules.i18n.__('ENUM').ACOES.EDICAO,
  exclusao: modules.i18n.__('ENUM').ACOES.EXCLUSAO,
  alteracaoStatus: modules.i18n.__('ENUM').ACOES.ALTERACAO_STATUS,
  iniciar: modules.i18n.__('ENUM').ACOES.INICIAR,
  pausar: modules.i18n.__('ENUM').ACOES.PAUSAR,
  finalizar: modules.i18n.__('ENUM').ACOES.FINALIZAR,
  arquivar: modules.i18n.__('ENUM').ACOES.ARQUIVAR
};
