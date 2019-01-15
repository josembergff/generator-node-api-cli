const objetivo = require("../repositories/objetivo");
const modules = require("../config/modules");
const objetivoService = require("./objetivo");
const parameters = require("../config/parameters");
const notificacao = require("../enums/notificacao");
const notificacaoService = require("./notificacao");

module.exports = {
  recalcularObjetivos: async () => {
    const lista = await objetivo.listaCompletaSemFinalizados();
    modules.lodash.forEach(lista, (linha, index) => {
      linha = objetivoService.atualizarObjetivo(linha);
      linha.save();
    });
  },

  objetivosAtrasados: async () => {
    let minutos = 0;
    let horario = modules
      .moment()
      .add(8, "hours")
      .toDate();
    const lista = await objetivo.listaAtrasados();
    modules.lodash.forEach(lista, (linha, index) => {
      minutos = minutos + 10;
      horario = modules
        .moment(horario)
        .add(minutos, "minutes")
        .toDate();

      let nomeGrupo = "sem grupo";
      if (linha.grupo && linha.grupo.nome) {
        nomeGrupo = linha.grupo.nome;
      }
      const mensagem =
        'O Objetivo "' +
        linha.nome +
        " (tempo de " +
        linha.tempo +
        ", progresso de " +
        linha.progresso +
        ')" do Grupo "' +
        nomeGrupo +
        '" está atrasado, está com o limite ' +
        linha.descricaoLimite +
        ".";
      const titulo = "Um Objetivo esta atrasado no grupo " + nomeGrupo;
      if (linha.grupo && linha.grupo.nome) {
        notificacaoService.nova(
          notificacao.Atrasos,
          titulo,
          mensagem,
          linha.criador,
          linha.grupo,
          null,
          true,
          horario
        );
      }
      notificacaoService.nova(
        notificacao.Atrasos,
        titulo,
        mensagem,
        linha.criador,
        null,
        null,
        true,
        horario
      );
    });
  },

  objetivosAtrasando: async () => {
    let minutos = 0;
    let horario = moment()
      .add(8, "hours")
      .toDate();
    const lista = await objetivo.listaAtrasando();
    lodash.forEach(lista, (linha, index) => {
      minutos = minutos + 10;
      horario = moment(horario)
        .add(minutos, "minutes")
        .toDate();

      let nomeGrupo = "sem grupo";
      if (linha.grupo && linha.grupo.nome) {
        nomeGrupo = linha.grupo.nome;
      }
      const mensagem =
        'O Objetivo "' +
        linha.nome +
        " (tempo de " +
        linha.tempo +
        ", progresso de " +
        linha.progresso +
        ')" do Grupo "' +
        nomeGrupo +
        '" está perto de chegar na data limite, está com o limite ' +
        linha.descricaoLimite +
        ".";
      const titulo = "Objetivo perto do limite em " + nomeGrupo;
      if (linha.grupo && linha.grupo.nome) {
        servicoNotificacao.nova(
          enumNotificacao.Atrasos,
          titulo,
          mensagem,
          linha.criador,
          linha.grupo,
          null,
          true,
          horario
        );
      }
      servicoNotificacao.nova(
        enumNotificacao.Atrasos,
        titulo,
        mensagem,
        linha.criador,
        null,
        null,
        true,
        horario
      );
    });
  }
};
