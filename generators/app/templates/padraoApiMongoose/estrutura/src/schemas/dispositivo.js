const modules = require("../config/modules");

const schema = new modules.mongoose.Schema({
  versaoCordova: {
    type: String,
    required: false
  },
  virtual: {
    type: Boolean,
    required: false
  },
  fabricante: {
    type: String,
    required: false
  },
  modelo: {
    type: String,
    required: false
  },
  plataforma: {
    type: String,
    required: false
  },
  serial: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    required: false
  },
  versao: {
    type: String,
    required: false
  },
  idNotificacao: {
    type: String,
    required: false
  },
  tagNotificacao: {
    type: modules.mongoose.Schema.Types.Mixed,
    required: false
  },
  principal: {
    type: Boolean,
    required: true,
    default: false
  },
  ativo: {
    type: Boolean,
    required: true,
    default: true
  },
  criacao: {
    type: Date,
    required: true,
    default: Date.now
  },
  edicao: {
    type: Date,
    required: false
  }
});

module.exports = schema;
