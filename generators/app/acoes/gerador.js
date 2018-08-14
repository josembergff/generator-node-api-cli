'use strict';
const enumAcoes = require('../enum/enum-acoes');
const questionador = require('./questionador');
const acionador = require('./acionador');


exports.acao = (atual) => {

    switch (atual.acao) {
        case enumAcoes.novoApiNodeMongoose:
            questionador.perguntasNovoApiNodeMongoose(atual)
                .then(data => {
                    acionador.novoProjetoApiNodeMongoose(atual, data);
                });
            break;
        case enumAcoes.novaEntidadeApiNodeMongoose:
            questionador.perguntasNovaEntidade(atual)
                .then(data => {
                    acionador.renomearEntidade(atual, data);
                    acionador.novoModeloApiNodeMongoose(atual, data);
                    acionador.novoRepositorioApiNodeMongoose(atual, data);
                    acionador.novoControleApiNodeMongoose(atual, data);
                    acionador.novoRotaApiNodeMongoose(atual, data);
                });
            break;
        case enumAcoes.novoModeloApiNodeMongoose:
            questionador.perguntasNovaEntidade(atual)
                .then(data => {
                    acionador.renomearEntidade(atual, data);
                    acionador.novoModeloApiNodeMongoose(atual, data);
                });
            break;
        case enumAcoes.novoControleApiNode:
            questionador.perguntasNovaEntidade(atual)
                .then(data => {
                    acionador.renomearEntidade(atual, data);
                    acionador.novoControleApiNodeMongoose(atual, data);
                });
            break;
        case enumAcoes.novoRepositorioApiNodeMongoose:
            questionador.perguntasNovaEntidade(atual)
                .then(data => {
                    acionador.renomearEntidade(atual, data);
                    acionador.novoRepositorioApiNodeMongoose(atual, data);
                });
            break;
        case enumAcoes.novaRotaApiNode:
            questionador.perguntasNovaEntidade(atual)
                .then(data => {
                    acionador.renomearEntidade(atual, data);
                    acionador.novoRotaApiNodeMongoose(atual, data);
                });
            break;
    }

};