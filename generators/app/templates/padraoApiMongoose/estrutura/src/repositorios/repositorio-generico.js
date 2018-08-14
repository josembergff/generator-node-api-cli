'use strict';
const mongoose = require('mongoose');
let Modelo;
let nomeModelo;

exports.modelo = (modelo) => {
    Modelo = mongoose.model(modelo);
    nomeModelo = modelo;
    return Modelo;
};

exports.criar = async (data) => {
    var modelo = new Modelo(data);
    await modelo.save();
    return modelo.id;
}

exports.buscarId = async (id) => {
    const modelo = await Modelo.findById(id);
    return modelo;
}

exports.buscar = async (filtro) => {
    const modelo = await Modelo.findOne(filtro);
    return modelo;
}

exports.editar = async (id, data) => {
    return await Modelo.findByIdAndUpdate(id, {
        $set: data
    });
}

exports.excluir = async (id) => {
    await Modelo.findOneAndRemove(id);
}

exports.listagem = async (filtro, campos) => {
    const lista = await Modelo.find(filtro, campos);
    return lista;
}

exports.quantidade = async (filtro) => {
    const quantidade = await Modelo.count(filtro);
    return quantidade;
}
