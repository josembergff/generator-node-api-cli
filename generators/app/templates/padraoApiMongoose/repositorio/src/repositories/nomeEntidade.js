const generic = require('./generic');
const padrao = () => {
  generic.modelo('<%=nomeEntidade%>');
  return generic;
};

const modelo = () => {
  return generic.modelo('<%=nomeEntidade%>');
};

module.exports = {
  padrao: padrao,

  nomeExterno: async () => {
    return '<%=nomeExternoEntidade%>';
  },

  nomeExternoPlural: async () => {
    return '<%=nomeExternoEntidadePlural%>';
  }
};
