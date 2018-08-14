'use strict';

let erros = [];

function Validacoes() {
    erros = [];
}

Validacoes.prototype.obrigatorio = (valor, msg) => {
    if (!valor || valor.length <= 0)
        erros.push({ msg: msg });
}

Validacoes.prototype.tamanhoMinimo = (valor, min, msg) => {
    if (!valor || valor.length < min)
        erros.push({ msg: msg });
}

Validacoes.prototype.tamanhoMaximo = (valor, max, msg) => {
    if (!valor || valor.length > max)
        erros.push({ msg: msg });
}

Validacoes.prototype.tamanhoFixo = (valor, len, msg) => {
    if (valor.length != len)
        erros.push({ msg: msg });
}

Validacoes.prototype.emailValido = (valor, msg) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(valor))
        erros.push({ msg: msg });
}

Validacoes.prototype.erros = () => {
    return erros;
}

Validacoes.prototype.limpar = () => {
    erros = [];
}

Validacoes.prototype.valido = () => {
    return erros.length == 0;
}

module.exports = Validacoes;
