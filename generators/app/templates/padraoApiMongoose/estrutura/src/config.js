global.CHAVE_PRIVADA = 'deea259b-f46c-41ad-b274-c5cadc49ff72-api<%= nomeProjeto %>';
global.TEMPLATE_EMAIL_BOASVINDAS = 'Olá, <strong>{0}</strong>, seja bem vindo!';
global.EMAIL_ENVIO = 'contato@<%= nomeProjeto %>.com';
global.ID_USUARIO_GERAL = 'SEU ID DE USUÁRIOS GERAL';

module.exports = {
    conexaoMongo: '<%= chaveMongo %>',
    chaveSendgrid: '<%= chaveSendgrid %>',
    chaveContainer: 'SUA CONNECTION STRING'
}