'use strict';
var config = require('../config');
const useragent = require('useragent');
const mongoose = require('mongoose');
const RegistroEmail = mongoose.model('RegistroEmail');
var sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(config.chaveSendgrid);
const enumEmail = require('../enumeradores/enum-email');

exports.enviarEmail = async (req, para, assunto, corpo, copia) => {
    const dados = {
        to: para,
        from: global.EMAIL_ENVIO,
        subject: assunto,
        html: corpo
    };
    if (copia) {
        dados.bcc = copia;
    }
    const navegadorUsuario = useragent.is(req.headers['user-agent']);
    var ipUsuario = "::1";
    if (req && req.connection && req.connection.remoteAddress && req.connection.remoteAddress.replace) {
        ipUsuario = req.connection.remoteAddress.replace("::ffff:", "");
    }
    const registro = {
        email: para,
        acao: enumEmail.Credencial,
        enviado: true,
        registro: dados,
        criador: global.ID_USUARIO_GERAL,
        ip: ipUsuario,
        navegador: navegadorUsuario
    };
    sendgrid.send(dados).then(dados => {
        var novoRegistro = new RegistroEmail(registro);
        novoRegistro.save();
    }).catch(erro => {
        registro.enviado = false;
        var novoRegistro = new RegistroEmail(registro);
        novoRegistro.save();
    });
}