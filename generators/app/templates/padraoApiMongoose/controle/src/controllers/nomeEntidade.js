const parameters = require('../config/parameters');
const autenticacao = require('../services/autenticacao');
const <%=nomeEntidade%>Repo = require('../repositories/<%=nomeEntidade%>');
const modules = require('../config/modules');
const notificacaoEnum = require('../enums/notificacao');
const notificacaoServ = require('../services/notificacao');

module.exports = {
  cadastrar: async (req, res, next) => {
    try {
      req.body.criador = await autenticacao.idUsuarioToken(req);
      await <%=nomeEntidade%>Repo.padrao().criar(req.body);
      res.status(200).send({
          msg: '<%=nomeExternoEntidade%> cadastrado com sucesso!'
      });
    } catch (e) {
      res.status(500).send({
          msg: 'Falha ao salvar o <%=nomeExternoEntidade%>.'
      });
    }
  },

    editar: async (req, res, next) => {
        try {
            req.body.editor = await autenticacao.idUsuarioToken(req);
            await <%=nomeEntidade%>Repo.padrao().editar(req.params.id, req.body);
            const objeto = await <%=nomeEntidade%>Repo.padrao().buscarId(req.params.id);
            res.status(200).send(objeto);
        } catch (e) {
            res.status(500).send({
                msg: "Falha ao editar o <%=nomeExternoEntidade%>.",
                msgErro: e
            });
        }
    },

  excluir: async (req, res, next) => {
    try {
      await <%=nomeEntidade%>Repo.padrao().excluir(req.params.id);
      res.status(200).send({
          msg: '<%=nomeExternoEntidade%> excluído com sucesso!'
      });
    } catch (e) {
      res.status(500).send({
          msg: 'Falha ao excluír o <%=nomeExternoEntidade%>.',
        msgErro: e
      });
    }
  },

  combo: async (req, res, next) => {
    try {
      const idUsuario = await autenticacao.idUsuarioToken(req);
        const lista = await <%=nomeEntidade%> Repo.padrao().listagemCombo(idUsuario);
      res.status(200).send(lista);
    } catch (e) {
      res.status(500).send({
          msg: 'Falha ao buscar o combo de <%=nomeExternoEntidadePlural%>.',
        msgErro: e
      });
    }
  },

  listar: async (req, res, next) => {
    try {
      const idUsuario = await autenticacao.idUsuarioToken(req);
      const lista = await <%=nomeEntidade%>Repo.padrao().listagem({criador: idUsuario});
      res.status(200).send(lista);
    } catch (e) {
      res.status(500).send({
          msg: 'Falha ao listar os <%=nomeExternoEntidadePlural%>.',
        msgErro: e
      });
    }
  },

    quantidadeLista: async (req, res, next) => {
        try {
            const idUsuario = await autenticacao.idUsuarioToken(req);
            const lista = await <%=nomeEntidade%>Repo.padrao().quantidade({ criador: idUsuario });
            res.status(200).send(lista);
        } catch (e) {
            res.status(500).send({
                msg: 'Falha ao verificar a quantidade da lista de <%=nomeExternoEntidadePlural%>.',
                msgErro: e
            });
        }
    },

  buscarId: async (req, res, next) => {
    try {
      const objeto = await <%=nomeEntidade%>Repo.padrao().buscarId(req.params.id);
      res.status(200).send(objeto);
    } catch (e) {
      res.status(500).send({
          msg: 'Falha ao busca o <%=nomeExternoEntidade%>.',
        msgErro: e
      });
    }
  }
};
