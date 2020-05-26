import React, { Fragment, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRatings from 'react-star-ratings';
import { Link } from "react-router-dom";

toast.configure();

const CalificarServicios = ({ setServ }) => {
    const [servicios, setServicios] = useState([]);
    const usuario_celular = localStorage.getItem('celular_usuario')
    const [rating, setRating] = useState(5);

    function changeRating(newRating) {
        if (newRating<1){
            setRating(1)

        }
        setRating(newRating)
        console.log(newRating);
        

    }

    async function Calificar(trabajador,servicio_id) {
        const body = {usuario:usuario_celular,trabajador:trabajador,calificacion:rating};
        const response = await fetch("http://localhost:5000/ServicioCalificado", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(body)
            });
            setServicios(servicios.filter(servicio => servicio.servicio_id !== servicio_id));

            

    }



    async function getServicios() {
        try {


            const body = { usuario: usuario_celular };


            const response = await fetch("http://localhost:5000/ServiciosPorCalificar", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            setServicios(jsonData);

        }
        catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        getServicios();

    }, []);

    ; return (
        <Fragment>
            <div className="container p4 text-center">
                <h1> Servicios a Calificar </h1>
                {" "}
                <table className="table mt-5 text-center">
                    <thead>
                        <tr>
                            <th>Labor realizada</th>
                            <th>Calificacion</th>
                            <th>Trabajador</th>
                            <th>Costo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map(servicio => (
                            <tr key={servicio.servicio_id}>
                                <td>{servicio.labor_nombre}</td>
                                <td>
                                <StarRatings
                                rating={rating}
                                starRatedColor="yellow"
                                changeRating={changeRating}
                                numberOfStars={5}
                                name='rating'
                                starDimension="20px"
                                starSpacing="5px"
                                
                            />
                                
                                </td>
                                <td>{servicio.trabajador_nombre_completo }</td>
                                <td>COP {servicio.servicio_costo}</td>

                                <td>  <button onClick={e=>Calificar(servicio.trabajador_documento,servicio.servicio_id)} type="button" className="btn btn-success" >Calificar</button></td>
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


export default CalificarServicios;