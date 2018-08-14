'use strict';

const express = require('express');
const router = express.Router();
const controle = require('../controles/controle-usuario');
const servicoAutenticacao = require('../servicos/servico-autenticacao');
const controleRegistroAcesso = require('../controles/controle-registro-acesso');

router.post('/',
    controleRegistroAcesso.cadastrarRegistro,
    controle.cadastrar);
router.post('/autenticar',
    controleRegistroAcesso.cadastrarAcessoEmail,
    controle.autenticar);
router.post('/atualizar',
    servicoAutenticacao.autorizar,
    controleRegistroAcesso.cadastrarAtualizar,
    controle.atualizarToken);
router.put('/recuperar',
    controleRegistroAcesso.cadastrarAtualizar,
    controle.recuperar);
router.put('/login/atualizar',
    servicoAutenticacao.autorizar,
    controleRegistroAcesso.cadastrarAtualizar,
    controle.atualizarSenha);


module.exports = router;