const modules = require('../config/modules');
let Modelo;
let nomeModelo;

module.exports = {
  modelo: modelo => {
    Modelo = modules.mongoose.model(modelo);
    nomeModelo = modelo;
    return Modelo;
  },

  nomeModelo: nomeModelo,

  criar: async data => {
    var modelo = new Modelo(data);
    let objeto = await modelo.save();
    return objeto;
  },

  buscarId: async id => {
    const modelo = await Modelo.findById(id);
    return modelo;
  },

  buscar: async filtro => {
    const modelo = await Modelo.findOne(filtro);
    return modelo;
  },

  editar: async (id, data) => {
    return await Modelo.findByIdAndUpdate(id, {
      $set: data
    });
  },

  excluir: async id => {
    await Modelo.remove({ _id: id });
  },

  listagem: async (filtro, campos) => {
    const lista = await Modelo.find(filtro, campos, {
      // skip: 0,  Starting Row
      // limit: 10,  Ending Row
      sort: {
        nome: 1 //Sort by Date Added DESC
      }
    });
    return lista;
  },

  listagemCombo: async idUsuario => {
    const lista = await Modelo.find({ criador: idUsuario }, 'nome', {
      sort: {
        nome: 1
      }
    });
    return lista;
  },

  quantidade: async filtro => {
    const quantidade = await Modelo.count(filtro);
    return quantidade;
  }
};
