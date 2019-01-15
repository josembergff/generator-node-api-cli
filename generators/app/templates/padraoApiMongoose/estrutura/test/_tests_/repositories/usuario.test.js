const models = global.appTest.get('models');

beforeEach(() => {
  models.grupo.remove({}).then(data => {
    console.info('Usuarios foram zerados.');
  });
});

describe('Repositorio usuario', () => {
  test('Listagem geral vazia', () => {
    const repoUsuario = require('../../../src/repositories/usuario');
    return repoUsuario
      .padrao()
      .listagem()
      .then(data => {
        expect(data.length).toBeGreaterThan(0);
      });
  });
});
