import React, { Fragment, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

toast.configure();

const MostrarTrabajos = ({ setContratando }) => {
    const [Labores, setLabores] = useState([]);
    const [usuario, setUsuario] = useState("");

    async function getUsuario() {
        try {

            const response = await fetch("http://localhost:5000/Autenticar/MostrarInscritas", {
                method: 'GET',
                headers: { token: localStorage.tokenUsuario }
            })

            const parseRES = await response.json();

            setUsuario(parseRES.usuario_nombre);
            console.log(parseRES);

            localStorage.setItem('celular_usuario', parseRES.usuario_celular)
            localStorage.setItem('latitud_usuario', parseRES.usuario_latitud)
            localStorage.setItem('longitud_usuario', parseRES.usuario_longitud)



        } catch (error) {
            console.error(error);

        }
    }
    useEffect(() => {
        getUsuario()
        getLabores()

    }, [])

    const getLabores = async () => {
        try {

            const response = await fetch("http://localhost:5000/Labor/ListarInscritas");


            const jsonData = await response.json();


            setLabores(jsonData);

        } catch (err) {
            console.error(err.message)

        }
    };
    const ListarTrabajadores = async (labor_id) => {
        try {
            localStorage.setItem('labor_id', labor_id);
            setContratando(true);


        } catch (error) {
            console.error();

        }
    }

    return <Fragment>
        <div className="container p4">
            <h1>Que labor deseas contratar {usuario} ?</h1>
            <div className="col text-left mt-5 ml-2 mb-2"  >
                <Link to="/UsuarioInicio"> <button className="btn btn-warning"> Inicio</button> </Link>
            </div>


            <div className="row">
                <div className="container shadow-lg p-5 mb-4 bg-white rounded">

                    <div className="d-flex justify-content-sm-center">
                        <form className="d-flex mt-5" >
                            {Labores.map(labor => (
                                <div key={labor.labor_id} className="card w-50 mr-3 text-white bg-dark mb-3 " >

                                    <div className="card-body">
                                        <h5 className="card-title">{labor.labor_nombre}</h5>
                                        <p className="card-text">{labor.labor_descripcion}.</p>
                                        <p style={{ color: 'white' }}> Trabajadores Disponibles : {labor.cantidad_trabajadores}</p>
                                        <button type="button" className="btn btn-warning" onClick={e => ListarTrabajadores(labor.labor_id, e)}>¡Seleccionar!</button>

                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </Fragment >;

};

export default MostrarTrabajos;