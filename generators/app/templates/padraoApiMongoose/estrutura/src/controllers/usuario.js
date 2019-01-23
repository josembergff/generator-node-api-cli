const parameters = require("../config/parameters");
const modules = require("../config/modules");
const usuarioRepo = require("../repositories/usuario");
const notificacaoEnum = require("../enums/notificacao");
const notificacaoServ = require("../services/notificacao");
const autenticacao = require("../services/autenticacao");

module.exports = {
  cadastrar: async (req, res, next) => {
    try {
      let usuarioExistente = await usuarioRepo.buscarEmail(req.body.email);

      if (usuarioExistente) {
        res
          .status(400)
          .send({ msg: "Email já cadastrado." })
          .end();
        return;
      }
      req.body.criador = parameters.idUsuarioGeral;
      req.body.senha = modules.md5(req.body.senha + parameters.chavePrivada);

      await usuarioRepo.padrao().criar(req.body);

      const mensagem =
        "Olá, <strong>" +
        req.body.nome +
        `</strong>, seja bem vindo ao ${parameters.nomeProjeto}!`;
      usuarioExistente = await usuarioRepo.buscarEmail(req.body.email);
      await notificacaoServ.nova(
        notificacaoEnum.BoasVindas,
        `Bem vindo ao ${parameters.nomeProjeto}`,
        mensagem,
        usuarioExistente,
        null,
        true,
        true
      );
      res.status(200).send({
        msg: "Usuário cadastrado com sucesso!"
      });
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao processar o cadastro de usuário",
        msgErro: e
      });
    }
  },

  autenticar: async (req, res, next) => {
    try {
      const usuario = await usuarioRepo.buscarAutenticacao(
        req.body.email,
        modules.md5(req.body.senha + parameters.chavePrivada)
      );
      if (!usuario) {
        res.status(500).send({
          msg: "Usuário e/ou senha inválidos"
        });
        return;
      }

      const dataAtual = new Date();

      const token = await autenticacao.gerarToken({
        _id: usuario._id,
        email: usuario.email,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
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
        msg: "Falha ao processar a autenticação",
        msgErro: e
      });
    }
  },

  atualizarToken: async (req, res, next) => {
    try {
      const usuarioSessao = await autenticacao.decodificarToken(req);

      const usuario = await usuarioRepo.padrao().bucarId(usuarioSessao._id);

      if (!usuario) {
        res.status(500).send({
          msg: "Cliente não encontrado"
        });
        return;
      }
      const dataAtual = new Date();
      const tokenData = await autenticacao.gerarToken({
        _id: usuario._id,
        email: usuario.email,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        criacao: dataAtual
      });
      res.status(200).send({
        _id: usuario._id,
        token: tokenData,
        email: usuario.email,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        foto: usuario.foto,
        criacao: dataAtual,
        atualizar: usuario.atualizar
      });
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao processar a renovação de token",
        msgErro: e
      });
    }
  },

  recuperar: async (req, res, next) => {
    try {
      const temporaria = modules.generator.generate({
        length: 10,
        numbers: true
      });

      const usuarioExistente = await usuarioRepo.buscarEmail(req.body.email);

      usuarioExistente.senha = modules.md5(
        temporaria + parameters.chavePrivada
      );
      usuarioExistente.atualizar = true;
      usuarioExistente.editor = parameters.idUsuarioGeral;
      usuarioExistente.edicao = new Date();

      await usuarioRepo.padrao().editar(usuarioExistente._id, usuarioExistente);
      const mensagem =
        'Para seu login ser recuperado acesse o sistema com a senha temporária "' +
        temporaria +
        '" para definir uma nova senha.';

      await notificacaoServ.nova(
        notificacaoEnum.ReseteSenha,
        `Recuperar login do ${parameters.nomeProjeto}`,
        mensagem,
        usuarioExistente,
        null,
        true,
        true
      );

      res.status(200).send({
        msg: "Recuperação de senha enviada por email."
      });
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao processar a recuperação de login",
        msgErro: e
      });
    }
  },

  atualizarSenha: async (req, res, next) => {
    try {
      const usuarioExistente = await usuarioRepo.buscarEmail(req.body.email);

      usuarioExistente.senha = modules.md5(
        req.body.senha + parameters.chavePrivada
      );
      usuarioExistente.atualizar = false;
      usuarioExistente.editor = parameters.idUsuarioGeral;
      usuarioExistente.edicao = new Date();

      await usuarioRepo.padrao().editar(usuarioExistente._id, usuarioExistente);
      const mensagem = "A seu login foi atualizado com sucesso.";

      await notificacaoServ.nova(
        notificacaoEnum.AtualizacaoSenha,
        `Recuperar login do ${parameters.nomeProjeto}`,
        mensagem,
        usuarioExistente,
        null,
        true,
        true
      );

      res.status(200).send({
        msg: "Login atualizado."
      });
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao processar a atualização do login",
        msgErro: e
      });
    }
  },

  atualizarDispositivo: async (req, res, next) => {
    try {
      if (req.body.idNotificacao || (req.body.modelo && req.body.plataforma)) {
        const usuarioSessao = await autenticacao.decodificarToken(req);
        let usuarioAtual = await usuarioRepo
          .padrao()
          .buscarId(usuarioSessao._id);

        let dispositivoId = modules.lodash.find(
          usuarioAtual.dispositivos,
          function(d) {
            return d.idNotificacao == req.body.idNotificacao;
          }
        );

        if (
          dispositivoId &&
          dispositivoId.idNotificao &&
          dispositivoId.idNotificao.length > 0
        ) {
          Object.assign(dispositivoId, req.body);
          dispositivoId.edicao = new Date();
        } else {
          let dispositivoNome = modules.lodash.find(
            usuarioAtual.dispositivos,
            function(d) {
              return (
                d.uuid == req.body.uuid &&
                d.modelo == req.body.modelo &&
                d.plataforma == req.body.plataforma
              );
            }
          );
          if (
            dispositivoNome &&
            dispositivoNome.modelo &&
            dispositivoNome.modelo.length > 0
          ) {
            Object.assign(dispositivoNome, req.body);
            dispositivoNome.edicao = new Date();
          } else {
            usuarioAtual.dispositivos.push(req.body);
            let ipUsuario = "::1";

            if (
              req &&
              req.connection &&
              req.connection.remoteAddress &&
              req.connection.remoteAddress.replace
            ) {
              ipUsuario = req.connection.remoteAddress.replace("::ffff:", "");
            }
            const mensagem =
              `Foi adicionado um novo dispositivo. Modelo: ${req.body.modelo}, Plataforma: ${req.body.plataforma}, IP: ${ipUsuario}. <br><br>Se foi você que acessou nada a ser feito, caso não tenha sido uma ação sua, por favor entre em contato conosco: contact@${parameters.nomeProjeto}.com.`;
            await notificacaoServ.nova(
              notificacaoEnum.NovoDispositivo,
              `Novo dispositivo adicionado no ${parameters.nomeProjeto}`,
              mensagem,
              usuarioAtual,
              null,
              true,
              true
            );
          }
        }

        await usuarioRepo.padrao().editar(usuarioSessao._id, {
          dispositivos: usuarioAtual.dispositivos
        });
      }
      res.status(200).send({
        msg: "Login atualizado com dados do dispositivo."
      });
    } catch (e) {
      res.status(500).send({
        msg:
          "Falha ao processar a atualização do login com os dados do dispositivo.",
        msgErro: e
      });
    }
  },

  buscarPorNome: async (req, res, next) => {
    try {
      const lista = await usuarioRepo.buscarNome(req.params.nome);

      res.status(200).send(lista);
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao buscar usuários por nome.",
        msgErro: e
      });
    }
  },

  usuariosOnline: async (req, res, next) => {
    try {
      const usuarioSessao = await autenticacao.decodificarToken(req);
      const lista = await usuarioRepo.buscarOnline(usuarioSessao._id);

      res.status(200).send(lista);
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao buscar usuários online.",
        msgErro: e
      });
    }
  },

  todosUsuarios: async (req, res, next) => {
    try {
      const usuarioSessao = await autenticacao.decodificarToken(req);
      const lista = await usuarioRepo.todosUsuarios(usuarioSessao._id);

      res.status(200).send(lista);
    } catch (e) {
      res.status(500).send({
        msg: "Falha ao buscar todos os usuários.",
        msgErro: e
      });
    }
  }
};
