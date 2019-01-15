const modules = require("../config/modules");
const dispositivo = require("../schemas/dispositivo");

const schema = new modules.mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome do Usuário é obrigatório"],
    trim: true
  },
  sobrenome: {
    type: String,
    required: false,
    trim: true
  },
  senha: {
    type: String,
    required: [true, "A senha do Usuário é obrigatório"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "O email do Usuário é obrigatório"],
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
    ref: "Usuario"
  },
  editor: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
});

module.exports = modules.mongoose.model("Usuario", schema);
