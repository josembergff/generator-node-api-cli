const express = require("express");
const socket = require("../enums/socket");

let app = express();
const io = app.get("io");

module.exports = {
  emitirMensagem: (email, mensagem, objeto) => {
    let msg = new objetoMensagem(mensagem, null, objeto.usuario);
    let grupo = new objetoGrupo(
      objeto.grupo ? objeto.grupo.id : null,
      objeto.grupo ? objeto.grupo.nome : null
    );
    let padrao = new objetoPadraoMensagem(msg, grupo);
    io.to(email).emit(socket.Notificacao, padrao);
  }
};
