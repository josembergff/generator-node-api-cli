const parameters = require("../config/parameters");
const modules = require("../config/modules");
const cron = require("../services/cron");
const notificacao = require("../services/notificacao");

module.exports = app => {
  if (parameters.prod || parameters.cron) {
    console.info("Cron ativado");

    modules.cron.schedule("* * * * *", () => {
      notificacao.enviarNotificacoes().then(data => {
        console.info("Cron - Notificações enviadas. ", data, new Date());
      });
    });

    modules.cron.schedule("1 0 * * *", () => {
      cron.recalcularObjetivos().then(() => {
        console.info("Cron - Recalcular objetivos. ", new Date());
      });
    });

    modules.cron.schedule("10 0 * * *", () => {
      cron.objetivosAtrasados().then(() => {
        console.info("Cron - Notificar objetivos atrasados. ", new Date());
      });
    });

    modules.cron.schedule("20 0 * * *", () => {
      cron.objetivosAtrasando().then(() => {
        console.info("Cron - Notificar objetivos atrasando. ", new Date());
      });
    });
  } else {
    console.info("Cron desativado");
  }
};
