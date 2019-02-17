const modules = require('../config/modules');

module.exports = {
  email: 'Email',
  facebook: 'Facebook',
  twitter: 'Twitter',
  google: 'Google',
  github: 'Github',
  desconectar: modules.i18n.__('ENUM').ACESSO.DESCONECTAR,
  registro: modules.i18n.__('ENUM').ACESSO.REGISTRO,
  resetar: modules.i18n.__('ENUM').ACESSO.RESETAR,
  atualizar: modules.i18n.__('ENUM').ACESSO.ATUALIZAR
};
