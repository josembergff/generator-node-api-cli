const mongoose = require('mongoose');
var configMongoose = '';
const parameters = require('../config/parameters');
const sistemaServ = require('../services/sistema');

const conexaoMongoose = () => {
  mongoose
    .connect(
      configMongoose,
      { useNewUrlParser: false }
    )
    .then(data => {
      console.info('Conectado ao MongoDb!');
      sistemaServ.manutencaoDados();
    })
    .catch(error => {
      const erroMessage =
        'Erro mongo - Code: ' + error.code + ', Message: ' + error.message;
      console.error(erroMessage);
    });
};

module.exports = app => {
  if (parameters.prod) {
    configMongoose = parameters.conexaoMongoProducao;
  }
  if (parameters.dev) {
    configMongoose = parameters.conexaoMongoDev;
  }
  if (parameters.test) {
    configMongoose = parameters.conexaoMongoTest;
  }

  console.info(
    `Mongoose prod: ${parameters.prod}, dev: ${parameters.dev}, test: ${
      parameters.test
    }`
  );

  conexaoMongoose();
};
