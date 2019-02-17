const modules = require('../config/modules');
const notificacao = require('../enums/notificacao');

const schema = new modules.mongoose.Schema({
  nome: {
    type: String,
    required: true,
    enum: modules.lodash.values(notificacao),
    trim: true,
    default: notificacao.Edicao
  },
  titulo: {
    type: String,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  enviarEmail: {
    type: Boolean,
    required: true,
    default: false
  },
  enviarPush: {
    type: Boolean,
    required: true,
    default: false
  },
  enviarSocket: {
    type: Boolean,
    required: true,
    default: false
  },
  dataEnviado: {
    type: Date,
    required: false
  },
  dataEnvio: {
    type: Date,
    required: true,
    default: Date.now
  },
  erroEnvio: {
    type: String,
    required: false
  },
  criacao: {
    type: Date,
    required: true,
    default: Date.now
  },
  edicao: {
    type: Date,
    required: false
  },
  criador: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  },
  editor: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

module.exports = modules.mongoose.model('Notificacao', schema);
