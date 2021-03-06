const baseLocal =
  'mongodb://baseteste:baseteste1@ds253468.mlab.com:53468/baseteste';
const baseTeste = 'mongodb://api:api@localhost:27017/nomebaseteste';
const i18n = require('i18n');

module.exports = {
  chavePrivada: 'deea259b-f46c-41ad-b274-c5cadc49ff72-apiapiVife',
  nomeProjeto: `apiVife`,
  descricaoProjeto: `API da Vife geral para todos os apps`,
  emailEnvio: `apiVife <${process.env.SMTP_EMAIL_USUARIO}>`,
  emailSenha: process.env.SMTP_SENHA_USUARIO,
  emailUsuario: process.env.SMTP_EMAIL_USUARIO,
  emailSMTP: process.env.SMTP_HOST,
  emailPorta: process.env.SMTP_PORT,
  emailSeguro: false,
  emailFalha: process.env.EMAIL_FALHAS,
  emailProvisorio: process.env.EMAIL_PROVISORIO,
  idUsuarioGeral: process.env.ID_GERAL,
  conexaoMongoTest: baseTeste,
  conexaoMongoDev: baseLocal,
  conexaoMongoProducao: `mongodb://${process.env.MONGO_LOGIN_USUARIO}:${
    process.env.MONGO_SENHA_USUARIO
  }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${
    process.env.MONGO_BANCO
  }`,
  appIdOneSignal: `${process.env.ONESIGNAL_APPID}`,
  tokenOneSignal: `${process.env.ONESIGNAL_TOKEN}`,
  chaveReq: 'apiVife-acesso-token',
  dev: process.env.NODE_ENV != 'prod' && process.env.NODE_ENV != 'test',
  prod: process.env.NODE_ENV == 'prod',
  test: process.env.NODE_ENV == 'test',
  cron: process.env.CRON_ATIVO == 'true',
  socket: process.env.SOCKET_ATIVO == 'true',
  chaveAnalytics: `${process.env.GOOGLEANALYTICS_CHAVE}`,
  rodapeMensagem: i18n.__(
    { phrase: i18n.__('SISTEMA').PARAMETROS.RODAPE_EMAIL },
    {
      nomeProjeto: '<%=nomeProjeto%>',
      email: process.env.SMTP_EMAIL_USUARIO
    }
  )
};
