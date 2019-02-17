const modules = require('../config/modules');
const dispositivo = require('../schemas/dispositivo');

const schema = new modules.mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  sobrenome: {
    type: String,
    required: false,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [
      true,
      modules.i18n.__(
        { phrase: modules.i18n.__('MODELO').PADRAO.EMAIL_OBRIGATORIO },
        {
          entidade: 'Usuário'
        }
      )
    ],
    trim: true,
    unique: true
  },
  foto: {
    type: String,
    required: false,
    trim: true
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  },
  online: {
    type: Boolean,
    required: true,
    default: false
  },
  atualizar: {
    type: Boolean,
    required: true,
    default: false
  },
  dispositivos: [dispositivo],
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
    ref: 'Usuario'
  },
  editor: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

module.exports = modules.mongoose.model('Usuario', schema);
