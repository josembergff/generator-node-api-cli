const parameters = require('../config/parameters');
const padraoMensagem = require('../objects/padraoMensagem');
const grupo = require('../objects/grupo');
const mensagem = require('../objects/mensagem');
const modules = require('../config/modules');
const autenticacao = require('../services/autenticacao');
const usuarioRepo = require('../repositories/usuario');
const grupoRepo = require('../repositories/grupo');
const socket = require('../enums/socket');

const objetoMensagem = mensagem;
const objetoGrupo = grupo;
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
          grupoRepo.listaCombo(usuario._id).then(grupos => {
            if (grupos && grupos.length > 0) {
              modules.lodash.forEach(grupos, (g, i) => {
                client.join(g._id);
                let textoEnvio = nomeCompleto + ' está online';
                let msg = new objetoMensagem(textoEnvio, null, usuario);
                let grupo = new objetoGrupo(g._id, g.nome);
                let padrao = new objetoPadraoMensagem(msg, grupo);
                client.broadcast.to(g._id).emit(socket.Conectado, padrao);
              });
              dadosCliente[client.id] = { u: usuario, g: grupos };
            } else {
              console.info('Socket: Usuário sem grupo.');
            }
          });
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
            let grupo = new objetoGrupo(null, null);
            let padrao = new objetoPadraoMensagem(msg, grupo);
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
