const modules = require("../config/modules");

const schema = new modules.mongoose.Schema({
  nome: {
    type: String,
    required: false
  },
  mensagem: {
    type: String,
    required: true
  },
  criador: {
    type: modules.mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  criacao: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = schema;
