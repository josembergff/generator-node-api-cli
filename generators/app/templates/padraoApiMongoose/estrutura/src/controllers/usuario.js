const parameters = require('../config/parameters');
const modules = require('../config/modules');
const usuarioRepo = require('../repositories/usuario');
const notificacaoEnum = require('../enums/notificacao');
const notificacaoServ = require('../services/notificacao');
const autenticacao = require('../services/autenticacao');

module.exports = {
  cadastrar: async (req, res, next) => {
    try {
      let usuarioExistente = await usuarioRepo.buscarEmail(req.body.email);

      if (usuarioExistente) {
        res
          .status(400)
          .send({ msg: res.__('SISTEMA').USUARIO.EMAIL_EXISTENTE })
          .end();
        return;
      }
      req.body.criador = parameters.idUsuarioGeral;
      req.body.senha = modules.md5(req.body.senha + parameters.chavePrivada);

      await usuarioRepo.padrao().criar(req.body);

      const mensagem = res.__('SISTEMA.EMAIL.BEM_VINDO', {
        nome: req.body.nome,
        nomeProjeto: parameters.nomeProjeto
      });
      usuarioExistente = await usuarioRepo.buscarEmail(req.body.email);
      await notificacaoServ.nova(
        notificacaoEnum.BoasVindas,
        res.__('SISTEMA.EMAIL.BEM_VINDO_PROJETO', {
          nomeProjeto: parameters.nomeProjeto
        }),
        mensagem,
        usuarioExistente,
        null,
        true,
        true
      );
      res.status(200).send({
        msg: res.__('SISTEMA.CRUD.CADASTRO_SUCESSO', { entidade: 'Usuário' })
      });
    } catch (e) {
      res.status(500).send({
        msg: res.__('SISTEMA.CRUD.CADASTRO_FALHA', { entidade: 'Usuário' }),
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
          msg: res.__('SISTEMA').USUARIO.USUARIO_INVALIDO
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
        msg: res.__('SISTEMA').USUARIO.FALHA_AUTENTICAR,
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
          msg: res.__('SISTEMA').USUARIO.USUARIO_NAO_ENCONTRADO
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
        msg: res.__('SISTEMA').USUARIO.FALHA_RENOVACAO_TOKEN,
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
      const mensagem = res.__('SISTEMA.EMAIL.SENHA_TEMPORARIA', {
        temporaria: temporaria
      });

      await notificacaoServ.nova(
        notificacaoEnum.ReseteSenha,
        res.__('SISTEMA.EMAIL.RECUPERAR_LOGIN_PROJETO', {
          nomeProjeto: parameters.nomeProjeto
        }),
        mensagem,
        usuarioExistente,
        null,
        true,
        true
      );

      res.status(200).send({
        msg: res.__('SISTEMA').USUARIO.FALHA_RECUPERACAO_SENHA
      });
    } catch (e) {
      res.status(500).send({
        msg: '',
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
      const mensagem = res.__('SISTEMA').EMAIL.LOGIN_ATUALIZADO;

      await notificacaoServ.nova(
        notificacaoEnum.AtualizacaoSenha,
        res.__('SISTEMA.EMAIL.RECUPERAR_LOGIN_PROJETO', {
          nomeProjeto: parameters.nomeProjeto
        }),
        mensagem,
        usuarioExistente,
        null,
        true,
        true
      );

      res.status(200).send({
        msg: res.__('SISTEMA.CRUD.EDICAO_SUCESSO', {
          entidade: 'Login'
        })
      });
    } catch (e) {
      res.status(500).send({
        msg: res.__('SISTEMA.CRUD.EDICAO_FALHA', {
          entidade: 'Login'
        }),
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
            let ipUsuario = '::1';

            if (
              req &&
              req.connection &&
              req.connection.remoteAddress &&
              req.connection.remoteAddress.replace
            ) {
              ipUsuario = req.connection.remoteAddress.replace('::ffff:', '');
            }
            const mensagem = res.__('SISTEMA.EMAIL.DISPOSITIVO_ADICIONADO', {
              modelo: req.body.modelo,
              plataforma: req.body.plataforma,
              ipUsuario: ipUsuario,
              nomeProjeto: parameters.nomeProjeto
            });
            await notificacaoServ.nova(
              notificacaoEnum.NovoDispositivo,
              res.__('SISTEMA.EMAIL.NOVO_DISPOSITIVO_ADICIONADO', {
                nomeProjeto: parameters.nomeProjeto
              }),
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
        msg: res.__('SISTEMA').USUARIO.LOGIN_DISPOSITIVO_ATUALIZADO
      });
    } catch (e) {
      res.status(500).send({
        msg: res.__('SISTEMA').USUARIO.FALHA_LOGIN_DISPOSITIVO_ATUALIZADO,
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
        msg: res.__('SISTEMA').USUARIO.FALHA_USUARIO_NOME,
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
        msg: res.__('SISTEMA').USUARIO.FALHA_USUARIOS_ONLINE,
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
        msg: res.__('SISTEMA').USUARIO.FALHA_LISTA_USUARIOS,
        msgErro: e
      });
    }
  }
};
