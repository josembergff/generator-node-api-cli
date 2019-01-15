const parameters = require("../config/parameters");
const modules = require("../config/modules");

const enviarNotificacao = dados => {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic " + parameters.tokenOneSignal
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var req = modules.https.request(options, function(res) {
    res.on("data", function(dados) {
      //console.info("Response com sucesso");
    });
  });

  req.on("error", function(e) {
    console.error("Erro envio push: ", e);
  });

  req.write(JSON.stringify(dados));
  req.end();
};

module.exports = {
  enviarPushPorEmail: (titulo, mensagem, email, objeto) => {
    var corpo = {
      app_id: parameters.appIdOneSignal,
      contents: { en: mensagem },
      filters: [{ field: "tag", key: "email", relation: "=", value: email }],
      data: objeto ? objeto : {}
    };
    enviarNotificacao(corpo);
  }
};
