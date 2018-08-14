'use strict';
const jwt = require('jsonwebtoken');

exports.gerarToken = async (data) => {
    return jwt.sign(data, global.CHAVE_PRIVADA, { expiresIn: '1d' });
}

exports.idUsuarioToken = async (req) => {
    var token = req.body.oftoken || req.headers['<%= nomeProjeto %>-acesso-token'];
    if (token) {
        try {
            var data = await jwt.verify(token, global.CHAVE_PRIVADA);
            return data._id;
        } catch (erro) {
            console.error("Falha na busca do token atual.");
            return null;
        }
    } else {
        return null;
    }
}

exports.decodificarToken = async (token) => {
    var data = await jwt.verify(token, global.CHAVE_PRIVADA);
    return data;
}

exports.autorizar = function (req, res, next) {
    var token = req.body.oftoken || req.headers['<%= nomeProjeto %>-acesso-token'];

    if (!token) {
        res.status(401).json({
            msg: 'Acesso Restrito'
        });
    } else {
        jwt.verify(token, global.CHAVE_PRIVADA, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    msg: 'Token Inválido'
                });
            } else {
                next();
            }
        });
    }
};

exports.administrador = function (req, res, next) {
    var token = req.body.oftoken || req.headers['<%= nomeProjeto %>-acesso-token'];

    if (!token) {
        res.status(401).json({
            msg: 'Token Inválido'
        });
    } else {
        jwt.verify(token, global.CHAVE_PRIVADA, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    msg: 'Token Inválido'
                });
            } else {
                if (decoded.permissoes && decoded.permissoes.includes('admin')) {
                    next();
                } else {
                    res.status(403).json({
                        msg: 'Esta funcionalidade é restrita para administradores'
                    });
                }
            }
        });
    }
};