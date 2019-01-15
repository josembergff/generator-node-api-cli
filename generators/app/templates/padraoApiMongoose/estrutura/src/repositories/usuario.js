const generic = require('./generic');
const modules = require('../config/modules');

const padrao = () => {
  generic.modelo('Usuario');
  return generic;
};

const modelo = () => {
  return generic.modelo('Usuario');
};

const modeloGrupo = () => {
  return generic.modelo('Grupo');
};
module.exports = {
  padrao: padrao,

  buscarEmail: async email => {
    const objeto = await padrao().buscar({ email: email });
    return objeto;
  },

  buscarAutenticacao: async (email, senha) => {
    const objeto = await padrao().buscar({
      email: email,
      senha: senha
    });
    return objeto;
  },

  buscarNome: async nome => {
    const objeto = await padrao().listagem(
      {
        $or: [
          { nome: new RegExp(nome, 'i') },
          { sobrenome: new RegExp(nome, 'i') },
          { email: new RegExp(nome, 'i') }
        ]
      },
      ['nome', 'sobrenome'],
      {
        sort: {
          nome: 1
        }
      }
    );
    return objeto;
  },

  marcarOnline: async (id, online) => {
    await padrao().editar(id, { online: online });
  },

  buscarOnline: async idUsuario => {
    const lista = await modeloGrupo().find(
      {
        $or: [{ criador: idUsuario }, { usuarios: idUsuario }]
      },
      ['nome', 'usuarios', 'criador']
    );
    let usuarios = modules.lodash.map(lista, 'criador');
    let compartilhados = modules.lodash.map(lista, 'usuarios');
    modules.lodash.forEach(compartilhados, e => {
      usuarios = usuarios.concat(e);
    });
    const objeto = await modelo().find(
      {
        $and: [
          { _id: { $in: usuarios } },
          { _id: { $ne: idUsuario } },
          { online: true }
        ]
      },
      ['nome', 'sobrenome'],
      {
        sort: {
          nome: 1
        }
      }
    );
    return objeto;
  },

  todosUsuarios: async idUsuario => {
    const lista = await modeloGrupo().find(
      {
        $or: [{ criador: idUsuario }, { usuarios: idUsuario }]
      },
      ['nome', 'usuarios', 'criador']
    );
    let usuarios = modules.lodash.map(lista, 'criador');
    let compartilhados = modules.lodash.map(lista, 'usuarios');
    modules.lodash.forEach(compartilhados, e => {
      usuarios = usuarios.concat(e);
    });
    const objeto = await modelo().find(
      {
        $and: [{ _id: { $in: usuarios } }, { _id: { $ne: idUsuario } }]
      },
      ['nome', 'sobrenome', 'online'],
      {
        sort: {
          nome: 1
        }
      }
    );
    return objeto;
  },

  temMobile: async idUsuario => {
    var dataSemanaPassada = new Date();
    var NoOfDays = 7;
    dataSemanaPassada.setDate(dataSemanaPassada.getDate() - NoOfDays);

    const objeto = await modelo().count({
      $and: [
        { _id: idUsuario },
        { 'dispositivos.uuid': { $ne: 'null' } },
        { 'dispositivos.idNotificao': { $ne: 'null' } },
        { 'dispositivos.uuid': { $ne: null } },
        { 'dispositivos.idNotificao': { $ne: null } }
      ],
      $and: [
        { 'dispositivos.edicao': { $lte: new Date() } },
        { 'dispositivos.edicao': { $gte: dataSemanaPassada } }
      ]
    });
    return objeto;
  },

  estaOnline: async idUsuario => {
    const objeto = await modelo().count({
      $and: [{ _id: idUsuario }, { online: true }]
    });
    return objeto;
  },

  usuariosGrupoOffline: async (idGrupo, idUsuario) => {
    const grupo = await modeloGrupo()
      .findById(idGrupo)
      .populate('criador')
      .populate('usuarios');
    let usuarios = [grupo.criador.id];
    modules.lodash.forEach(grupo.usuarios, e => {
      usuarios.push(e.id);
    });
    const objeto = await modelo().find({
      $and: [
        { _id: { $in: usuarios } },
        { _id: { $ne: idUsuario } },
        { online: { $ne: true } }
      ]
    });
    return objeto;
  },

  marcarTodosOffline: async () => {
    await modelo().update({ online: true }, { $set: { online: false } });
  }
};
