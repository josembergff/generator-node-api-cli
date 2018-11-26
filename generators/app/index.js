const Generator = require('yeoman-generator');
const yosay = require('yosay');
const gerador = require('./acoes/gerador');
const enumAcoes = require('./enum/enum-acoes');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('direct');
    this.argument('typeCommand', { type: String, required: false });
  }

  initializing() {
    if (!this.options.direct) {
      this.log(yosay('Welcome to the API project manager at Node.js!'));
    }
  }

  default() {}

  prompting() {
    var atual = this;
    if (this.options.direct) {
      atual.acao = this.options.typeCommand;
      gerador.acao(atual);
    } else {
      this.prompt({
        type: 'list',
        name: 'type',
        message: 'Choose what you want to do in your project?',
        choices: [
          {
            name: 'Create new API project with MongoDB:',
            value: enumAcoes.novoApiNodeMongoose
          },
          {
            name: 'Create new Entity with MongoDB:',
            value: enumAcoes.novaEntidadeApiNodeMongoose
          },
          {
            name: 'Create New Route:',
            value: enumAcoes.novaRotaApiNode
          },
          {
            name: 'Create New Controller:',
            value: enumAcoes.novoControleApiNode
          },
          {
            name: 'Create new Repository with Mongoose:',
            value: enumAcoes.novoRepositorioApiNodeMongoose
          },
          {
            name: 'Create new Mongoose Template:',
            value: enumAcoes.novoModeloApiNodeMongoose
          }
        ]
      }).then(function(tipo) {
        atual.acao = tipo.type;
        gerador.acao(atual);
      });
    }
  }

  writing() {}
};
