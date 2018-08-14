const app = require('../src/app');
const debug = require('debug')('<%= nomeProjeto %>:api');
const http = require('http');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.info('API <%= nomeExternoProjeto %> rodando na porta ' + port);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    console.error('Erro geral de "syscall"!', error);
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requer privilégios superores.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' atualmente em uso.');
      process.exit(1);
      break;
    default:
      console.error('Erro geral!', error);
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'porta ' + addr.port;
  // console.info('Rodando em ' + bind);
}