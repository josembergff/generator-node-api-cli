const express = require('express');
const bodyParser = require('body-parser');
const i18n = require('i18n');
let app = express();
const http = require('http');
const loader = require('./autoLoader');
process.env.TZ = 'America/Sao_Paulo';

i18n.configure({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  directory: __dirname + '/locales'
});

// Habilita o CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept-Type, of-acesso-token'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(
  bodyParser.json({
    limit: '5mb'
  })
);

app.use(i18n.init);

const portServer = process.env.PORT || '3000';

app.set('port', portServer);

const server = http.createServer(app);
const io = require('socket.io')(server);
app.set('io', io);

app = loader.config(app);

server.listen(portServer, () => {
  console.info(
    'API <%= nomeExternoProjeto %> rodando na porta ' +
      portServer +
      ' , e na url http://localhost:' +
      portServer
  );
});

app.use((err, req, res, next) => {
  const mensagemErro =
    'Falha geral - Url:' +
    req.url +
    ' Params:' +
    JSON.stringify(req.params) +
    ' Body:' +
    JSON.stringify(req.body) +
    ' Query:' +
    JSON.stringify(req.query) +
    ' Method:' +
    req.method;
  console.error(mensagemErro);
  res.status(500).send({
    msg: 'Falha interna servidor.',
    msgErro: mensagemErro
  });

  next();
});
