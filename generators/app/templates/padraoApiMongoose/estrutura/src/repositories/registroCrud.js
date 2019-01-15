const generic = require("./generic");
const padrao = () => {
  generic.modelo("RegistroCrud");
  return generic;
};

const modelo = () => {
  return generic.modelo("RegistroCrud");
};

module.exports = {
  padrao: padrao
};
