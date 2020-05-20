const pool = require('../db');
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { jwtGeneratorUsuario, jwtGeneratorTrabajador } = require('../utils/jwtGenerator');
const validacion = require('../middleware/validaciones');
const autorizacionUsuario = require('../middleware/autorizacionUsuario');
const autorizacionTrabajador = require('../middleware/autorizacionTrabajador')

router.get("/MostrarInscritas", autorizacionUsuario, async (req, res) => {

    try {
        const usuario = await pool.query("SELECT * FROM usuario WHERE usuario_celular = $1", [req.user]
        )
        res.json(usuario.rows[0])



    } catch (error) {
        console.error(error);
        res.status(500).send('Error')

    }
})


//Registro Usuario
router.post('/RegistrarUsuario', validacion, async (req, res) => {
    try {

        const body = req.body;


        const campos = '(usuario_celular,usuario_nombre,usuario_apellido,usuario_latitud,usuario_longitud,usuario_direccion,usuario_foto_recibo,usuario_numero_medio_pago,usuario_tipo_medio_pago,usuario_correo,usuario_documento,usuario_password)'
        const nombre = body.usuario_nombre, apellido = body.usuario_apellido, correo = body.usuario_correo, celular = body.usuario_celular;
        const direccion = body.usuario_direccion, documento = body.usuario_documento, password = body.usuario_password, latitud = body.usuario_latitud, longitud = body.usuario_longitud;
        const pago = body.usuario_numero_medio_pago, tipo = body.usuario_tipo_medio_pago, foto = body.usuario_foto_recibo



        /////////////////////////////////////////////////////////////7
        const response = await pool.query('SELECT * FROM Usuario WHERE usuario_celular = $1', [celular])
        if (response.rows.length !== 0) {
            return res.status(401).send('Ya existe el usuario')
        }

        const saltRounds = 10;
        const Salt = await bcrypt.genSalt(saltRounds)
        const bcryptpassword = await bcrypt.hash(password, Salt);

        /////////////////////////////////////////

        const newUsuario = await pool.query("INSERT INTO usuario" + campos + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *;",
            [celular, nombre, apellido, latitud, longitud, direccion, foto, pago, tipo, correo, documento, bcryptpassword]);


        ////////////////////////////////////////////

        const token = jwtGeneratorUsuario(newUsuario.rows[0].usuario_celular)
        return res.json({ token });

    } catch (err) {
        console.error(err);


    }
})

//Registro Trabajador
router.post('/RegistrarTrabajador', async (req, res) => {
    try {

        const body = req.body;

        const campos = '(trabajador_documento,trabajador_nombre,trabajador_apellido,trabajador_latitud,trabajador_longitud,trabajador_direccion,trabajador_foto_documento,trabajador_foto_perfil,trabajador_password)'
        const nombre = body.trabajador_nombre, apellido = body.trabajador_apellido;
        const direccion = body.trabajador_direccion, documento = body.trabajador_documento, password = body.trabajador_password, latitud = body.trabajador_latitud, longitud = body.trabajador_longitud;
        const foto_documento = body.trabajador_foto_documento, foto_perfil = body.trabajador_foto_perfil
        /////////////////////////////////////////////////////////////
        const response = await pool.query('SELECT * FROM trabajador WHERE trabajador_documento = $1', [documento])
        if (response.rows.length !== 0) {
            return res.status(401).send('Ya existe el trabajador')
        }

        const saltRounds = 10;
        const Salt = await bcrypt.genSalt(saltRounds)
        const bcryptpassword = await bcrypt.hash(password, Salt);

        /////////////////////////////////////////
        const newTrabajador = await pool.query("INSERT INTO trabajador" + campos + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;",
            [documento, nombre, apellido, latitud, longitud, direccion, foto_documento, foto_perfil, bcryptpassword]);

        /////////////////////////////////////////

        const token = jwtGeneratorTrabajador(newTrabajador.rows[0].trabajador_documento)
        return res.json({token});


    } catch (error) {
        console.error(error);

    }
})


////////////////////////////////////Login///////////////////////


router.post('/LoginUsuario', async (req, res) => {
    try {

        const { usuario_celular, usuario_password } = req.body;


        ////////////////////////////////////////////

        const usuario = await pool.query('SELECT * FROM usuario WHERE usuario_celular = $1', [usuario_celular])

        if (usuario.rows.length == 0) {
            return res.status(401).send('Contraseña o celular no existe')
        }

        //////////////////////////////////////////
        const contraseñaValida = await bcrypt.compare(usuario_password, usuario.rows[0].usuario_password)
        if (!contraseñaValida) {
            res.status(401).send('Contraseña incorrecta')

        }

        const token = jwtGeneratorUsuario(usuario.rows[0].usuario_celular)

        res.json({ token })

    } catch (err) {
        console.error(err);
        res.status(401).send('Error')


    }
})

///////////////////////////////////////////


////////////////////////////////////Login///////////////////////


router.post('/LoginTrabajador', async (req, res) => {
    try {

        const { trabajador_documento, trabajador_password } = req.body;


        ////////////////////////////////////////////

        const trabajador = await pool.query('SELECT * FROM trabajador WHERE trabajador_documento = $1', [trabajador_documento])

        if (trabajador.rows.length == 0) {
            return res.status(401).send('Contraseña o Documento no existe')
        }

        //////////////////////////////////////////
        const contraseñaValida = await bcrypt.compare(trabajador_password, trabajador.rows[0].trabajador_password)
        if (!contraseñaValida) {
            res.status(401).send('Contraseña incorrecta')

        }

        const token = jwtGeneratorTrabajador(trabajador.rows[0].trabajador_documento)

        res.json({ token })

    } catch (err) {
        console.error(err);
        res.status(401).send('Error')


    }
})

///////////////////////////////////////////
router.get("/esta-verificado-usuario", autorizacionUsuario, async (req, res) => {
    try {
        res.json(true);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error')

    }
})
///////////////////////////////////////////


router.get("/esta-verificado-trabajador", autorizacionTrabajador, async (req, res) => {
    try {
        res.json(true);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error')

    }
})

module.exports = router;