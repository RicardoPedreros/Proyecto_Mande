const jwt = require ('jsonwebtoken');

require('dotenv').config();
const config = require('../config/config')
const llaveUsuario = config.llaveUsuario;


module.exports = async(req,res,next) =>{
    try {
        const jwToken = req.header('token');
        if(!jwToken){
            return res.status(401).json('Acceso no autorizado')
        }
        
        const payload = jwt.verify(jwToken,"usuario123")

        req.user = payload.usuario;
        
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json('Acceso no autorizado')
    }
}