const modules = require('../config/modules');
const acoes = require('../enums/acoes');

const schema = new modules.mongoose.Schema({
  modelo: {
    type: String,
    required: [
      true,
      modules.i18n.__('MODELO.PADRAO.NOME_OBRIGATORIO', {
        entidade: 'Modelo'
      })
    ],
    trim: true
  },
  navegador: {
    type: modules.mongoose.Schema.Types.Mixed,
    required: false,
    trim: true
  },
  ip: {
    type: String,
    required: false,
    trim: false
  },
  acao: {
    type: String,
    required: [true, modules.i18n.__('MODELO').ENUM.ACAO],
    enum: modules.lodash.values(acoes),
    trim: true
  },
  criacao: {
    type: Date,
    required: true,
    default: Date.now
  },
  registro: {
    type: modules.mongoose.Schema.Types.Mixed,
    required: [true, modules.i18n.__('MODELO').PADRAO.OBJETO_REGISTRO]
  },
  registroAtual: {
    type: modules.mongoose.Schema.Types.Mixed,
    required: false
  },
  criador: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
});

module.exports = modules.mongoose.model('RegistroCrud', schema);
