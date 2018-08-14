'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('pt-br');
var momentoAtual = moment();

router.get('/', (req, res, next) => {
    res.status(200).send({
        api: "<%= nomeExternoProjeto %> API",
        online: momentoAtual.fromNow()
    });
});

module.exports = router;