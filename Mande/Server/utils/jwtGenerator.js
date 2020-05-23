const jwt = require('jsonwebtoken');
const config = require('../config/config');
require('dotenv').config();
const llaveUsuario = config.llaveUsuario;
const llaveTrabajador = config.llaveTrabajador;

function jwtGeneratorUsuario (usuario_celular){
    const payload = {
        usuario: usuario_celular

    }
    
    
    return jwt.sign(payload,"usuario123",{expiresIn: 60*10})
}

function jwtGeneratorTrabajador (trabajador_documento){
    const payload = {
        trabajador: trabajador_documento
    }
    return jwt.sign(payload,"trabajador123",{expiresIn: 60*10})
}


module.exports = {jwtGeneratorUsuario,jwtGeneratorTrabajador};
