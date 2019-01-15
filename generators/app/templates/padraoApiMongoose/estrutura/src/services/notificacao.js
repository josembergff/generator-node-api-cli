const notificacaoRepo = require("../repositories/notificacao");
const modules = require("../config/modules");
const parameters = require("../config/parameters");
const email = require("../externalServices/email");
const onesignal = require("../externalServices/onesignal");
const socket = require("../externalServices/socket");

const temMobile = lista => {
  var dataSemanaPassada = new Date();
  var NoOfDays = 7;
  dataSemanaPassada.setDate(dataSemanaPassada.getDate() - NoOfDays);
  return modules.lodash.find(lista, function(o) {
    return (
      o.uuid != null &&
      o.uuid != "null" &&
      o.idNotificao != null &&
      o.idNotificao != "null" &&
      (o.edicao
        ? o.edicao >= dataSemanaPassada
        : o.criacao >= dataSemanaPassada)
    );
  })
    ? true
    : false;
};

const finalizar = async (notificacao, enviado) => {
  try {
    notificacao.edicao = new Date();
    if (enviado) {
      notificacao.dataEnviado = new Date();
    }

    await notificacaoRepo.padrao().editar(notificacao.id, notificacao);
    if (!enviado) {
      console.info("Notificação editada com o erro ocorrido.");
    }
  } catch (e) {
    console.error("Falha ao finalizar a Notificação. ", e);
  }
};

const listaEmails = notificacao => {
  const retorno = [];
  if (
    notificacao.criador &&
    notificacao.criador.email
  ) {
    let novoValor = {
      mobile: temMobile(notificacao.criador.dispositivos),
      online: notificacao.criador.online,
      email: notificacao.criador.email
    };
    retorno.push(novoValor);
  }

  return retorno;
};

const enviarNotificacoes = async () => {
  let quantidadeNotificacoes = 0;
  try {
    const lista = await notificacaoRepo.listaParaEnvio();
    let emails = [];
    let itemAtual = {};
    modules.lodash.forEach(lista, (linha, index) => {
      try {
        emails = listaEmails(linha);
        const objetoEnvio = { usuario: linha.criador };

        modules.lodash.forEach(emails, (item, index) => {
          itemAtual = item;
          var reg = new RegExp(
            /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          );
          if (item.email && reg.test(item.email)) {
            if (parameters.prod || parameters.cron) {
              let notificacaoEnviada = false;

              if (linha.enviarPush && item.mobile && !item.online) {
                onesignal.enviarPushPorEmail(
                  linha.titulo,
                  linha.mensagem,
                  item.email,
                  objetoEnvio
                );
                quantidadeNotificacoes++;
                notificacaoEnviada = true;
              }

              if (linha.enviarSocket && item.online) {
                socket.emitirMensagem(item.email, linha.mensagem, objetoEnvio);
                quantidadeNotificacoes++;
                notificacaoEnviada = true;
              }

              if (
                (linha.enviarEmail && !item.mobile && !item.online) ||
                !notificacaoEnviada
              ) {
                email.enviarEmail(item.email, linha.titulo, linha.mensagem);
                quantidadeNotificacoes++;
              }
            } else {
              console.info(
                "Notificações desativadas. Email, titulo, mensagem: ",
                item.email,
                linha.titulo,
                linha.mensagem
              );
            }
          } else {
            let mensagemEmailInvalido = `Email inválido:  ${item.email}`;
            console.info(mensagemEmailInvalido);
            new Error(mensagemEmailInvalido);
          }
        });

        finalizar(linha, true);
      } catch (ee) {
        linha.erroEnvio = `Falha na linha de envio da notificação. Erro: ${JSON.stringify(
          ee
        )}; Título: ${linha.titulo}, Email: ${itemAtual.email}, Mobile: ${
          itemAtual.mobile
        }, Online: ${itemAtual.online}, Emails: ${JSON.stringify(
          emails
        )}, Linha: ${index}, Enviar e-mail: ${
          linha.enviarEmail
        }, Enviar Push: ${linha.enviarPush}, Enviar Sockeet: ${
          linha.enviarSocket
        }`;
        console.error(linha.erroEnvio);
        finalizar(linha, false);
        email.enviarEmail(parameters.emailFalha, linha.titulo, linha.erroEnvio);
      }
    });
    return quantidadeNotificacoes;
  } catch (e) {
    console.error("Falha geral no envio da notificação. ", e);
    return null;
  }
};
module.exports = {
  enviarNotificacoes: enviarNotificacoes,

  nova: async (
    nome,
    titulo,
    mensagem,
    usuario,
    somenteEmail,
    imediato,
    dataInicio
  ) => {
    try {
      let idUsuario = null;
      if (usuario && typeof usuario === "string") {
        idUsuario = usuario;
      } else {
        idUsuario = usuario.id || usuario._id;
      }
      const notificacao = {
        nome: nome,
        titulo: titulo,
        mensagem: mensagem,
        criador: idUsuario
      };

      if (dataInicio) {
        notificacao.dataEnvio = dataInicio;
      }

      if (somenteEmail == undefined || somenteEmail == null) {
        notificacao.enviarEmail = true;
        notificacao.enviarPush = true;
        notificacao.enviarSocket = true;
      }

      if (
        somenteEmail != undefined &&
        somenteEmail != null &&
        somenteEmail == true
      ) {
        notificacao.enviarEmail = true;
        notificacao.enviarPush = false;
        notificacao.enviarSocket = false;
      }

      if (
        somenteEmail != undefined &&
        somenteEmail != null &&
        somenteEmail == false
      ) {
        notificacao.enviarEmail = false;
        notificacao.enviarPush = true;
        notificacao.enviarSocket = true;
      }
      await notificacaoRepo
        .padrao()
        .criar(notificacao)
        .then(data => {
          console.info("Notificação cadastrado com sucesso!");
          if (imediato) {
            enviarNotificacoes();
          }
        })
        .catch(data => {
          console.error("Falha ao criar a Notificação. ", notificacao, data);
        });
    } catch (e) {
      console.error("Falha ao salvar a Notificação. ", e);
    }
  },

  excluir: async notificacao => {
    try {
      await notificacaoRepo.padrao().excluir(notificacao.id);
      console.info("Notificação excluído com sucesso!");
    } catch (e) {
      console.error("Falha ao excluir a Notificação. ", e);
    }
  },

  listar: async () => {
    try {
      const lista = await notificacaoRepo.listaParaEnvio();
      return lista;
    } catch (e) {
      console.error("Falha ao listar as Notificacoes. ", e);
      return null;
    }
  },

  buscarId: async id => {
    try {
      const objeto = await notificacaoRepo.buscarPorId(id);
      return objeto;
    } catch (e) {
      console.error("Falha ao busca o Notificação. ", e);
      return null;
    }
  }
};
