const generic = require("./generic");
const padrao = () => {
  generic.modelo("RegistroAcesso");
  return generic;
};

const modelo = () => {
  return generic.modelo("RegistroAcesso");
};
module.exports = {
  padrao: padrao
};
