const modules = require('../config/modules');

const schema = new modules.mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descricao: {
    type: String,
    required: false,
    trim: true
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
  },
  criador: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  editor: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

module.exports = modules.mongoose.model('<%=nomeEntidade%>', schema);
