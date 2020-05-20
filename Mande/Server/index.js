const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require('body-parser');
const Joi = require('joi');

//middleware

app.use(cors());
app.use(express.json());
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/Json
app.use(bodyParser.json());



//Routes
app.use('/Autenticar',require('./routes/jwt'))

//Create a Labor

app.post("/Labor/Create", async (req, res) => {
    try {
        const body = req.body;
        const schema = {
            labor_nombre: Joi.string(),
            labor_descripcion: Joi.string()
        }
        const labor_nombre = body.labor_nombre;
        const labor_descripcion = body.labor_descripcion;


        const newLabor = await pool.query(
            "INSERT INTO labor(labor_nombre,labor_descripcion) VALUES ($1,$2) RETURNING *;",
            [labor_nombre, labor_descripcion]);

        res.json(newLabor.rows[0]);


    } catch (err) {
        console.error(err.message);


    }
})

//CREATE AN USUARIO
app.post("/Usuario/Create", async (req, res) => {
    try {
        const body = req.body;
        
        const campos = '(usuario_celular,usuario_nombre,usuario_apellido,usuario_latitud,usuario_longitud,usuario_direccion,usuario_foto_recibo,usuario_numero_medio_pago,usuario_tipo_medio_pago,usuario_correo,usuario_documento,usuario_password)'
        const nombre = body.usuario_nombre, apellido = body.usuario_apellido,correo = body.usuario_correo,celular = body.usuario_celular;
        const direccion = body.usuario_direccion, documento = body.usuario_documento, password = body.usuario_password,latitud = body.usuario_latitud,longitud = body.usuario_longitud;
        const pago = body.usuario_numero_medio_pago,tipo = body.usuario_tipo_medio_pago, foto = body.usuario_foto_recibo

        
        const newUsuario = await pool.query("INSERT INTO usuario" + campos +  " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *;",
            [celular,nombre,apellido,latitud,longitud,direccion,foto,pago,tipo,correo,documento,password]);

        res.json(newUsuario.rows[0]);


    } catch (err) {
        console.error(err.message);


    }
})


//Get all Usuarios

app.get("/Usuario/Listar", async (req, res) => {
    try {

        const allUsuarios = await pool.query("SELECT *  FROM usuario");
        res.json(allUsuarios.rows);

    } catch (err) {

        console.error(err.message);


    }

})






//Get all Trabajadores

app.get("/Trabajador/Listar", async (req, res) => {
    try {

        const allTrabajadores = await pool.query("SELECT *  FROM trabajador");
        res.json(allTrabajadores.rows);

    } catch (err) {

        console.error(err.message);


    }

})


//Get all Labores

app.get("/Labor/Listar", async (req, res) => {
    try {

        const allLabores = await pool.query("SELECT * FROM labor");
        res.json(allLabores.rows);

    } catch (err) {

        console.error(err.message);


    }

})

//Get all Labores inscritos

app.get("/Labor/ListarInscritas", async (req, res) => {
    try {

        const allLabores = await pool.query("SELECT labor_id,labor_nombre,labor_descripcion FROM labor natural join trabajadores_realizan_labores" );
        res.json(allLabores.rows);

    } catch (err) {

        console.error(err.message);


    }

})

//Get a Labor
app.get("/Labor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const labor = await pool.query("SELECT * FROM labor WHERE labor_id = $1", [id])

        res.json(labor.rows[0]);
    } catch (err) {
        console.error(err.message);

    }

})

//Update a Labor
app.put("/Labor/Edit", async (req, res) => {
    try {
        const body = req.body;

        const schema = {
            labor_id: Joi.string(),
            labor_n: Joi.string().min(1).max(50).required().regex(/^[^±!@£$%^&*_+§¡€#¢¶•ªº«\\/<>?:;|=.,]{1,50}$/),
            labor_d: Joi.string().min(1).max(50).required().regex(/^[^±!@£$%^&*_+§¡€#¢¶•ªº«\\/<>?:;|=.,]{1,50}$/),

        }
        const labor_id = body.labor_id;
        const labor_n = body.labor_n;
        const labor_d = body.labor_d;



        const labor = await pool.query("UPDATE labor SET labor_nombre = $1,labor_descripcion = $2 WHERE labor_id = $3",
            [labor_n, labor_d, labor_id]);
        res.json("Labor actualizada");




    } catch (err) {
        console.error(err.message);

    }
})


//Delete a Labor

app.delete("/Labor/Delete", async (req, res) => {
    try {
        const body = req.body;

        const schema = {
            labor_id: Joi.string().min(10).max(13).required().regex(/^[0-9]+$/)
        }
        const labor_id = body.labor_id;
        const deleteLabor = await pool.query("DELETE FROM labor WHERE labor_id = $1", [labor_id]);

        res.json("Labor eliminada")

    } catch (err) {
        console.log(err.message);
    }
})




app.listen(5000, () => {
    console.log("Server has started on port 5000")
})