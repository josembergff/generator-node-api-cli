const usuarioRepo = require('../repositories/usuario');

module.exports = {
  manutencaoDados: async () => {
    if (global.marcarTodosOffline) {
      console.info(
        'Manutenção sistema: Todos os usuários marcados como offline.'
      );
      usuarioRepo.marcarTodosOffline();
    } else {
      console.info('Manutenção sistema: Existe usuários online.');
    }
  }
};
