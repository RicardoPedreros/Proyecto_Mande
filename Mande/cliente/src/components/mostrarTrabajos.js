import React, { Fragment, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const MostrarTrabajos = ({setContratando}) => {
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
            localStorage.setItem('celular_usuario',parseRES.celular_usuario)
            localStorage.setItem('latitud_usuario',parseRES.usuario_latitud)
            localStorage.setItem('longitud_usuario',parseRES.usuario_longitud)



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
            localStorage.setItem('labor_id',labor_id);
            setContratando(true);


        } catch (error) {
            console.error();

        }
    }

    return <Fragment>
        <div className="container p4">
            <h1>Que labor deseas contratar {usuario} ?</h1>

            <div className="row">
                <div className="container shadow-lg p-5 mb-4 bg-white rounded">

                    <div className="d-flex justify-content-sm-center">
                        <form className="d-flex mt-5" >
                            {Labores.map(labor => (
                                <div key={labor.labor_id} className="card w-50 mr-3 text-white bg-info mb-3 " >

                                    <div className="card-body">
                                        <h5 className="card-title">{labor.labor_nombre}</h5>
                                        <p className="card-text">{labor.labor_descripcion}.</p>
                                        <p style={{ color: 'black' }}> Trabajadores Disponibles : {labor.cantidad_trabajadores}</p>
                                        <button type="button" className="btn btn-success" onClick={e => ListarTrabajadores(labor.labor_id, e)}>¡Seleccionar!</button>

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