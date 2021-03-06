const parameters = require('../config/parameters');
const modules = require('../config/modules');

module.exports = {
  enviarEmail: async (paraEmail, titulo, mensagem) => {
    const destino =
      paraEmail == parameters.emailFalha
        ? paraEmail
        : parameters.emailProvisorio;
    const dados = {
      to: paraEmail,
      from: parameters.emailEnvio,
      subject: titulo,
      html: `${mensagem} ${parameters.rodapeMensagem}`
    };

    modules.nodemailer.sendMail(dados, (error, info) => {
      if (error) {
        return console.error(error);
      }
      console.info('Mensagem enviada: %s', info.messageId);
      console.info(
        'Visualizar URL: %s',
        modules.nodemailer.getTestMessageUrl(info)
      );
    });
  }
};
