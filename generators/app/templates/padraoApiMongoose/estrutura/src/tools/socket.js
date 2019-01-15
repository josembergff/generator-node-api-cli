const parameters = require('../config/parameters');
const padraoMensagem = require('../objects/padraoMensagem');
const mensagem = require('../objects/mensagem');
const modules = require('../config/modules');
const autenticacao = require('../services/autenticacao');
const usuarioRepo = require('../repositories/usuario');
const socket = require('../enums/socket');

const objetoMensagem = mensagem;
const objetoPadraoMensagem = padraoMensagem;
let dadosCliente = [];

const marcarOffline = () => {
  const marcar = !dadosCliente || dadosCliente.length <= 0;
  global.marcarTodosOffline = marcar;
  return marcar;
};

module.exports = app => {
  const io = app.get('io');
  if ((!parameters.test || parameters.socket) && io) {
    console.info('Socket ativado');

    const validation = (client, next) => {
      let token = client.handshake.query.token;
      if (token) {
        return next();
      }
      return next(new Error('authentication error'));
    };

    io.use(validation);

    marcarOffline();

    io.on('connection', client => {
      io.setMaxListeners(20);
      const token = client.handshake.query.token;

      autenticacao.decodificarTokenString(token).then(usuario => {
        if (usuario) {
          let nomeCompleto = usuario.nome + ' ' + (usuario.sobrenome || '');
          usuarioRepo.marcarOnline(usuario._id, true);
          client.join(usuario.email);
          dadosCliente[client.id] = { u: usuario };
          
        }
      });

      client.on('disconnect', () => {
        if (!marcarOffline() && dadosCliente[client.id]) {
          let nomeCompleto =
            dadosCliente[client.id].u.nome +
            ' ' +
            (dadosCliente[client.id].u.sobrenome || '');
          usuarioRepo.marcarOnline(dadosCliente[client.id].u._id, false);
          modules.lodash.forEach(dadosCliente[client.id].g, (g, i) => {
            let textoEnvio = nomeCompleto + ' está offline';
            let msg = new objetoMensagem(
              textoEnvio,
              null,
              dadosCliente[client.id].u
            );
            let padrao = new objetoPadraoMensagem(msg);
            client.broadcast.to(g._id).emit(socket.Desconectado, padrao);
          });
          delete dadosCliente[client.id];

          marcarOffline();
        }
      });
    });
  } else {
    console.info('Socket desativado');
  }
};
