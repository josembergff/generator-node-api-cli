'use strict';
const rename = require("gulp-rename");
const destino = '';
// destino = './generators/temp';

exports.renomearEntidade = (atual, data) => {
    atual.registerTransformStream(rename(function (path) {
        path.basename = path.basename.replace(/(<%=nomeEntidade%>)/g, data.nomeEntidade);
        path.dirname = path.dirname.replace(/(<%=nomeEntidade%>)/g, data.nomeEntidade);
    }));
};

exports.novoProjetoApiNodeMongoose = (atual, data) => {
    atual.fs.copyTpl(
        atual.templatePath('./padraoApiMongoose/estrutura'),
        atual.destinationPath(destino), {
            nomeProjeto: data.nomeProjeto,
            nomeExternoProjeto: data.nomeExternoProjeto,
            descricaoProjeto: data.descricaoProjeto,
            chaveMongo: data.chaveMongo,
            chaveSendgrid: data.chaveSendgrid
        }
    );
    atual.log('Obs.: Após criado o projeto novo, confirme as configurações de acesso ao Mongo e SendGrid em "src/config.js". Execute o "npm install" atualizar os módulos.');
};

exports.novoRepositorioApiNodeMongoose = (atual, data) => {
    atual.fs.copyTpl(
        atual.templatePath('./padraoApiMongoose/repositorio'),
        atual.destinationPath(destino), {
            nomeEntidade: data.nomeEntidade,
            nomeExternoEntidade: data.nomeExternoEntidade,
            nomeExternoEntidadePlural: data.nomeExternoEntidadePlural
        }
    );
};

exports.novoModeloApiNodeMongoose = (atual, data) => {
    atual.fs.copyTpl(
        atual.templatePath('./padraoApiMongoose/modelo'),
        atual.destinationPath(destino), {
            nomeEntidade: data.nomeEntidade,
            nomeExternoEntidade: data.nomeExternoEntidade,
            nomeExternoEntidadePlural: data.nomeExternoEntidadePlural
        }
    );
    atual.log('Obs.: Após criado o arquivo do modelo é necessário adicionar nas configurações do projeto no arquivo "src/app.js".');
};

exports.novoControleApiNodeMongoose = (atual, data) => {
    atual.fs.copyTpl(
        atual.templatePath('./padraoApiMongoose/controle'),
        atual.destinationPath(destino), {
            nomeEntidade: data.nomeEntidade,
            nomeExternoEntidade: data.nomeExternoEntidade,
            nomeExternoEntidadePlural: data.nomeExternoEntidadePlural
        }
    );
};

exports.novoRotaApiNodeMongoose = (atual, data) => {
    atual.fs.copyTpl(
        atual.templatePath('./padraoApiMongoose/rota'),
        atual.destinationPath(destino), {
            nomeEntidade: data.nomeEntidade,
            nomeExternoEntidade: data.nomeExternoEntidade,
            nomeExternoEntidadePlural: data.nomeExternoEntidadePlural
        }
    );
    atual.log('Obs.: Após criado o arquivo de rota é necessário adicionar nas configurações do projeto no arquivo "src/app.js".');
};