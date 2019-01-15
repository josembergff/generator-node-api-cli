const generic = require("./generic");
const modules = require("../config/modules");

const padrao = () => {
  generic.modelo("notificacao");
  return generic;
};

const modelo = () => {
  return generic.modelo("notificacao");
};

module.exports = {
  padrao: padrao,

  listaParaEnvio: async idUsuario => {
    var dataOntem = new Date();
    var NoOfDays = 3;
    dataOntem.setDate(dataOntem.getDate() - NoOfDays);

    const lista = await modelo()
      .find({
        dataEnviado: null,
        $and: [
          { dataEnvio: { $gte: dataOntem } },
          { dataEnvio: { $lte: new Date() } }
        ]
      })
      .populate("criador")
      .populate({
        path: "grupo",
        model: "Grupo",
        populate: [
          {
            path: "usuarios",
            model: "Usuario"
          },
          {
            path: "criador",
            model: "Usuario"
          }
        ]
      })
      .populate("editor");
    return lista;
  },

  buscarPorId: async id => {
    const objeto = await modelo()
      .findById(id)
      .populate("criador")
      .populate({
        path: "grupo",
        model: "Grupo",
        populate: [
          {
            path: "usuarios",
            model: "Usuario"
          },
          {
            path: "criador",
            model: "Usuario"
          }
        ]
      })
      .populate("editor");
    return objeto;
  },

  buscarQuantidadeDia: async (nome, idUsuario) => {
    const objeto = await padrao().quantidade({
      nome: nome,
      dataEnviado: { $lte: modules.moment().startOf("day") },
      criador: idUsuario
    });
    return objeto;
  }
};
