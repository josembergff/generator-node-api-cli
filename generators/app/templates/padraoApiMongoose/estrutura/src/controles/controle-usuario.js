'use strict';
const validacoes = require('../validacoes/validacoes');
const md5 = require('md5');
const servicoAutenticacao = require('../servicos/servico-autenticacao');
const servicoEmail = require('../servicos/servico-email');
const enumAcesso = require('../enumeradores/enum-acesso');
const repositorioUsuario = require('../repositorios/repositorio-usuario');
const generator = require('generate-password');

exports.cadastrar = async (req, res, next) => {
    try {
        let validar = new validacoes();
        validar.tamanhoMinimo(req.body.nome, 3, 'O nome deve conter pelo menos 3 caracteres');
        validar.emailValido(req.body.email, 'E-mail inválido');
        validar.tamanhoMinimo(req.body.senha, 6, 'A senha deve conter pelo menos 6 caracteres');

        // Se os dados forem inválidos
        if (!validar.valido()) {
            res.status(400).send(validar.erros()).end();
            return;
        }

        const usuarioExistente = await repositorioUsuario.buscarEmail(req.body.email);

        if (usuarioExistente) {
            res.status(400).send({ msg: 'Email já cadastrado.' }).end();
            return;
        }
        req.body.criador = global.ID_USUARIO_GERAL;
        req.body.senha = md5(req.body.senha + global.CHAVE_PRIVADA);

        await repositorioUsuario.padrao().criar(req.body);

        const corpo = global.TEMPLATE_EMAIL_BOASVINDAS.replace('{0}', req.body.nome) + ' Acesse <a href="www.<%= nomeProjeto %>.com"><%= nomeProjeto %>.com</a>';
        servicoEmail.enviarEmail(req,
            req.body.email,
            'Bem vindo ao <%= nomeExternoProjeto %>',
            corpo);
        res.status(200).send({
            msg: 'Usuário cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            msg: 'Falha ao processar o cadastro de usuário',
            msgErro: e
        });
    }
};

exports.autenticar = async (req, res, next) => {
    try {
        const usuario = await repositorioUsuario.buscarAutenticacao(
            req.body.email,
            md5(req.body.senha + global.CHAVE_PRIVADA)
        );
        if (!usuario) {
            res.status(500).send({
                msg: 'Usuário e/ou senha inválidos'
            });
            return;
        }

        const dataAtual = new Date();

        const token = await servicoAutenticacao.gerarToken({
            _id: usuario._id,
            email: usuario.email,
            nome: usuario.nome,
            criacao: dataAtual
        });

        res.status(200).send({
            _id: usuario._id,
            token: token,
            email: usuario.email,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            foto: usuario.foto,
            criacao: dataAtual,
            atualizar: usuario.atualizar
        });
    } catch (e) {
        res.status(500).send({
            msg: 'Falha ao processar a autenticação',
            msgErro: e
        });
    }
};

exports.atualizarToken = async (req, res, next) => {
    try {
        const token = req.body.oftoken || req.headers['<%= nomeProjeto %>-acesso-token'];

        const data = await servicoAutenticacao.decodificarToken(token);

        const usuario = await repositorioUsuario.padrao().bucarId(data._id);

        if (!usuario) {
            res.status(500).send({
                msg: 'Cliente não encontrado'
            });
            return;
        }
        const dataAtual = new Date();
        const tokenData = await servicoAutenticacao.gerarToken({
            _id: usuario._id,
            email: usuario.email,
            nome: usuario.nome,
            criacao: dataAtual
        });
        res.status(200).send({
            _id: usuario._id,
            token: tokenData,
            email: usuario.email,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            foto: usuario.foto,
            criacao: dataAtual
        });
    } catch (e) {
        res.status(500).send({
            msg: 'Falha ao processar a renovação de token',
            msgErro: e
        });
    }
};

exports.recuperar = async (req, res, next) => {
    try {

        let validar = new validacoes();
        validar.emailValido(req.body.email, 'E-mail inválido');

        // Se os dados forem inválidos
        if (!validar.valido()) {
            res.status(400).send(validar.erros()).end();
            return;
        }


        const temporaria = generator.generate({
            length: 10,
            numbers: true
        });

        const usuarioExistente = await repositorioUsuario.buscarEmail(req.body.email);

        usuarioExistente.senha = md5(temporaria + global.CHAVE_PRIVADA);
        usuarioExistente.atualizar = true;
        usuarioExistente.editor = global.ID_USUARIO_GERAL;
        usuarioExistente.edicao = new Date();

        await repositorioUsuario.padrao().editar(usuarioExistente._id, usuarioExistente);
        const corpo = 'Para seu login ser recuperado acesse o sistema com a senha temporária "' + temporaria + '" para definir uma nova senha. Acesse <a href="www.<%= nomeProjeto %>.com"><%= nomeProjeto %>.com</a>';
        servicoEmail.enviarEmail(req,
            req.body.email,
            'Recuperar login do <%= nomeExternoProjeto %>',
            corpo);
        res.status(200).send({
            msg: 'Recuperação de senha enviada por email.'
        });
    } catch (e) {
        res.status(500).send({
            msg: 'Falha ao processar a recuperação de login',
            msgErro: e
        });
    }
}

exports.atualizarSenha = async (req, res, next) => {
    try {

        let validar = new validacoes();
        validar.emailValido(req.body.email, 'E-mail inválido');
        validar.tamanhoMinimo(req.body.senha, 6, 'A senha deve conter pelo menos 6 caracteres');

        // Se os dados forem inválidos
        if (!validar.valido()) {
            res.status(400).send(validar.erros()).end();
            return;
        }

        const usuarioExistente = await repositorioUsuario.buscarEmail(req.body.email);

        usuarioExistente.senha = md5(req.body.senha + global.CHAVE_PRIVADA);
        usuarioExistente.atualizar = false;
        usuarioExistente.editor = global.ID_USUARIO_GERAL;
        usuarioExistente.edicao = new Date();

        await repositorioUsuario.padrao().editar(usuarioExistente._id, usuarioExistente);
        const corpo = 'A seu login foi atualizado com sucesso. Acesse <a href="www.<%= nomeProjeto %>.com"><%= nomeProjeto %>.com</a>';
        servicoEmail.enviarEmail(req,
            req.body.email,
            'Login atualizado no <%= nomeExternoProjeto %>',
            corpo);
        res.status(200).send({
            msg: 'Login atualizado.'
        });
    } catch (e) {
        res.status(500).send({
            msg: 'Falha ao processar a atualização do login',
            msgErro: e
        });
    }
}