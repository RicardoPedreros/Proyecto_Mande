const jwt = require ('jsonwebtoken');
require('dotenv').config();
const config = require('../config/config')
const llaveTrabajador = config.llaveTrabajador;

module.exports = async(req,res,next) =>{
    try {
        const jwToken = req.header('token');
        if(!jwToken){
            return res.status(401).json('Acceso no autorizado')
        }
        
        const payload = jwt.verify(jwToken,llaveTrabajador)

        req.user = payload.trabajador;
        
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json('Acceso no autorizado')
    }
}