const parameters = require("../config/parameters");
const modules = require("../config/modules");
const notificacao = require("../services/notificacao");

module.exports = app => {
  if (parameters.prod || parameters.cron) {
    console.info("Cron ativado");

    modules.cron.schedule("* * * * *", () => {
      notificacao.enviarNotificacoes().then(data => {
        console.info("Cron - Notificações enviadas. ", data, new Date());
      });
    });

  } else {
    console.info("Cron desativado");
  }
};
