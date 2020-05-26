import React, { Fragment, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRatings from 'react-star-ratings';
import { Link, Redirect } from "react-router-dom";

toast.configure();

const MostrarTrabajadores = ({ setServ }) => {
    const [trabajadores, setTrabajadores] = useState([]);
    const labor_id = localStorage.getItem('labor_id')
    const usuario_celular = localStorage.getItem('celular_usuario')

    const NuevoServicio = async (trabajador_documento) => {
        localStorage.setItem('trabajador_documento',trabajador_documento);
        setServ(true);
    }


    async function getTrabajadores(parametro) {
        try {
            
            const body = { labor_id: labor_id, usuario_celular: usuario_celular, distancia_maxima: 70000000,parametro};
        

            const response = await fetch("http://localhost:5000/Labor/ListarTrabajadores", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData)
            {


            setTrabajadores(jsonData);
            console.log(jsonData);
            
            }


        } catch (err) {
            console.error(err.message)

        }
    }


    useEffect(() => {
        getTrabajadores(1);

    },[]);

    ; return (
        <Fragment>
            <div className="container p4 text-center">
                <h1>Escoge tu trabajador</h1>
                <div className="form-row">
                    <div className="form-grop col-md-4">
                        <button onClick={e=> getTrabajadores(1)} className="btn btn-warning"> Ordenar por distancia</button>

                    </div>
                    <div className="form-grop col-md-4">
                        <button onClick={e=> getTrabajadores(2)} className="btn btn-warning"> Ordenar por reputacion</button>

                    </div>
                    <div className="form-grop col-md-4">
                        <button onClick={e=> getTrabajadores(3)} className="btn btn-warning"> Ordenar por precio</button>

                    </div>
                </div>
                {" "}
                <table className="table mt-5 text-center">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Calificacion</th>
                            <th>Distancia</th>
                            <th>Costo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trabajadores.map(trabajador => (
                            <tr key={trabajador.documento}>
                                <td>{trabajador.nombre} {trabajador.apellido} </td>
                                <td><StarRatings
                                    rating={parseFloat(trabajador.reputacion)}
                                    starDimension="30px"
                                    starSpacing="5px"
                                    starRatedColor="black"
                                /></td>
                                <td>{trabajador.distancia} Km </td>
                                <td>COP {trabajador.costo}</td>

                                <td>  <button type="button" className="btn btn-warning" onClick={e => NuevoServicio(trabajador.documento)}>¡Contratar!</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="container p4 text-center">
                <Link to = "/UsuarioInicio"><h2>Inicio</h2> </Link>
            </div>
        </Fragment>
    );
};


export default MostrarTrabajadores;