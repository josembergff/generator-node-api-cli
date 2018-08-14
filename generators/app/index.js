const Generator = require("yeoman-generator")
const yosay = require("yosay")
const gerador = require("./acoes/gerador")
const enumAcoes = require("./enum/enum-acoes")
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  initializing() {
    this.log(yosay("Welcome to the API project manager at Node.js!"))
  }

  default() {}

  prompting() {
    var atual = this
    this.prompt({
      type: "list",
      name: "type",
      message: "Choose what you want to do in your project?",
      choices: [
        {
          name: "Create new API project with MongoDB:",
          value: enumAcoes.novoApiNodeMongoose
        },
        {
          name: "Create new Entity with MongoDB:",
          value: enumAcoes.novaEntidadeApiNodeMongoose
        },
        {
          name: "Create New Route:",
          value: enumAcoes.novaRotaApiNode
        },
        {
          name: "Create New Controller:",
          value: enumAcoes.novoControleApiNode
        },
        {
          name: "Create new Repository with Mongoose:",
          value: enumAcoes.novoRepositorioApiNodeMongoose
        },
        {
          name: "Create new Mongoose Template:",
          value: enumAcoes.novoModeloApiNodeMongoose
        }
      ]
    }).then(function(tipo) {
      atual.acao = tipo.type
      gerador.acao(atual)
    })
  }

  writing() {}
}
