const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require('body-parser');
const Joi = require('joi');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/public')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
  var upload = multer({ storage: storage })

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

        const allLabores = await pool.query("SELECT * FROM Labor_Disponible");
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
//Get an User
app.post("/InformacionUsuario", async (req, res) => {
    try {
        const {usuario_celular} = req.body;
        const usuario = await pool.query("SELECT * FROM usuario WHERE usuario_celular = $1", [usuario_celular])

        res.json(usuario);
        
    } catch (err) {
        console.error(err.message);

    }

})
//Get a trabajador
app.post("/InformacionTrabajador", async (req, res) => {
    try {
        console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        
        const {trabajador_documento} = req.body;
        const trabajador = await pool.query("SELECT * FROM trabajador WHERE trabajador_documento = $1", [trabajador_documento])

        res.json(trabajador);
        console.log(req.body);
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

//GET TRABAJADORES DISPONIBLES

app.post("/Labor/ListarTrabajadores",async(req,res) =>{
    try {
        const body = req.body;
        
        const trabajadores = await pool.query("SELECT * FROM buscar_trabajadores($1,$2,$3,$4)",[body.labor_id,body.usuario_celular,body.distancia_maxima,body.parametro]);
        res.json(trabajadores.rows);
    } catch (error) {
        console.error(error);
        
    }
}
)

//CREATE SERVICIO

app.post("/Servicio",async(req,res)=>{
    try {
        const body = req.body
        console.log(body);
        
        const servicio = await pool.query("SELECT * FROM agregar_servicio($1,$2,$3,$4)",[body.usuario,body.trabajador,body.labor,body.descripcion])
        res.json(servicio.rows)
    } catch (error) {
        console.error(error);
        
    }
})

//CANCEL SERVICIO

app.post("/ServicioCancelar",async(req,res)=>{
    try {
        const body = req.body
        const servicioCancelar = await pool.query("SELECT * FROM cancelar_servicio($1)",[body.trabajador])
        res.json(servicioCancelar.rows)
    } catch (error) {
        console.error(error);
        
    }
})

//TRABAJADOR OBTIENE UN SERVICIO

app.post("/ServicioAsignado",async(req,res)=>{
    try {
        const {documento} = req.body;

        const servicioObtenido = await pool.query('SELECT * FROM servicio_contratado($1)',[documento])


        res.json(servicioObtenido);
        
        
    } catch (error) {
        console.error(error);
        
    }
})

//Llego Trabajado al servicio 
app.post("/ServicioLlegada",async(req,res)=>{
    console.log(req.body)
    try {
        const {documento} = req.body;

        const ServicioLlegada = await pool.query('SELECT activar_servicio($1)',[documento])


        res.json(ServicioLlegada);
        
        
    } catch (error) {
        console.error(error);
        
    }
})


//Termino el servicio 
app.post("/ServicioTerminado",async(req,res)=>{
    console.log(req.body)
    try {
        const {documento,duracion} = req.body;

        const ServicioTerminado = await pool.query('SELECT terminar_servicio($1,$2)',[documento,duracion])


        res.json(ServicioTerminado);
        
        
    } catch (error) {
        console.error(error);
        
    }
})

app.post('/esta-pendiente',async(req,res)=>{
    try {
        
        const {usuario,trabajador} = req.bodyM
        const esta_pendiente = await pool.query('SELECT * from servicio_a_calificar($1,$2)',[usuario,trabajador])
        res.json(esta_pendiente.rows[0].servicio_a_calificar);
    } catch (error) {
        console.error(error);
        
    }
})

//Califico el servicio 
app.post("/ServicioCalificado",async(req,res)=>{
    console.log(req.body)
    try {
        const {usuario,trabajador,calificacion} = req.body;

        const servicioCalificado = await pool.query('SELECT calificar_servicio($1,$2,$3)',[usuario,trabajador,calificacion])


        res.json(servicioCalificado);
        
        
    } catch (error) {
        console.error(error);
        
    }
})

//CALIFICAR SERVICIOS
app.post('/ServiciosPorCalificar',async(req,res)=>{
    try {
        const Servicios = await pool.query('SELECT * FROM servicios_por_calificar($1)',[req.body.usuario])

        res.json(Servicios.rows)
        
    } catch (error) {
        console.error(error);
        
    }
})

//SUBIR ARCHIVO

app.post('/upload', upload.single('file'), (req, res, next) => {
    console.log(__dirname);
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
  
  });


app.listen(5000, () => {
    console.log("Server has started on port 5000")
})