const pool = require('./db');
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const bcrypt = require('bcryptjs');

//Registro Usuario
router.post('/', async (req, res) => {
    try {

        const body = req.body;
        
        
        const campos = '(usuario_celular,usuario_nombre,usuario_apellido,usuario_latitud,usuario_longitud,usuario_direccion,usuario_foto_recibo,usuario_numero_medio_pago,usuario_tipo_medio_pago,usuario_correo,usuario_documento,usuario_password)'
        const nombre = body.usuario_nombre, apellido = body.usuario_apellido,correo = body.usuario_correo,celular = body.usuario_celular;
        const direccion = body.usuario_direccion, documento = body.usuario_documento, password = body.usuario_password,latitud = body.usuario_latitud,longitud = body.usuario_longitud;
        const pago = body.usuario_numero_medio_pago,tipo = body.usuario_tipo_medio_pago, foto = body.usuario_foto_recibo

        
        
        /////////////////////////////////////////////////////////////7
        const response = await pool.query('SELECT * FROM Usuario WHERE usuario_celular = $1', [celular])
        if (response.rows.length !== 0) {
            return res.status(401).send('Ya existe el usuario')
        }

        const saltRounds = 10;
        const Salt = await bcrypt.genSalt(saltRounds)
        const bcryptpassword = await bcrypt.hash(password, Salt);

        /////////////////////////////////////////

        const newUsuario = await pool.query("INSERT INTO usuario" + campos +  " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *;",
        [celular,nombre,apellido,latitud,longitud,direccion,foto,pago,tipo,correo,documento,bcryptpassword]);

        res.json(newUsuario.rows[0])

    } catch (err) {
        console.error(err);


    }
})


module.exports = router;