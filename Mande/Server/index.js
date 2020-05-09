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


//Create a Labor

app.post("/Labor/Create", async (req, res) => {
    try {
        const body = req.body;
        const schema ={
            labor_nombre: Joi.string().min(1).max(50).required().regex(/^[^±!@£$%^&*_+§¡€#¢¶•ªº«\\/<>?:;|=.,]{1,50}$/),
            labor_descripcion: Joi.string().min(1).max(50).required().regex(/^[^±!@£$%^&*_+§¡€#¢¶•ªº«\\/<>?:;|=.,]{1,50}$/)
        }
        const labor_nombre = body.labor_nombre;
        const labor_descripcion = body.labor_descripcion;

        
        const newLabor = await pool.query(
            "INSERT INTO labor(labor_nombre,labor_descripcion) VALUES ($1,$2) RETURNING *;",
            [labor_nombre,labor_descripcion]);

        res.json(newLabor.rows[0]);


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