const modules = require("../config/modules");
const acesso = require("../enums/acesso");

const schema = new modules.mongoose.Schema({
  modelo: {
    type: String,
    required: [true, "O nome do Modelo é obrigatório"],
    trim: true
  },
  acao: {
    type: String,
    required: [true, "Obrigatório o tipo de acesso."],
    enum: modules.lodash.values(acesso),
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
  criacao: {
    type: Date,
    required: true,
    default: Date.now
  },
  registro: {
    type: modules.mongoose.Schema.Types.Mixed,
    required: [true, "Obrigatório o objeto do registro."]
  },
  criador: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
});

module.exports = modules.mongoose.model("RegistroAcesso", schema);
