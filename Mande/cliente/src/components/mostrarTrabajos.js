import React, { Fragment, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const MostrarTrabajos = () => {
    const [Labores, setLabores] = useState([]);
    const [usuario,setUsuario] = useState("");

    async function getUsuario(){
        try {

            const response = await fetch("http://localhost:5000/Autenticar/MostrarInscritas",{
                method:'GET',
                headers: {token : localStorage.tokenUsuario}
            })

            const parseRES = await response.json();
            
            setUsuario(parseRES.usuario_nombre);
            
            
              
        } catch (error) {
            console.error(error);
            
        }
    }
    useEffect(()=>{
        getUsuario()
        getLabores()
     
    },[])

    const getLabores = async () => {
        try {
            
            const response = await fetch("http://localhost:5000/Labor/ListarInscritas");


            const jsonData = await response.json();


            setLabores(jsonData);

        } catch (err) {
            console.error(err.message)

        }
    };

    console.log(Labores);

    return <Fragment>
        <div className="container p4">
            <h1>Que labor deseas contratar {usuario} ?</h1>

            <div className="row">
                {Labores.map(labor => (
                    
                    <div className="col-mt-5 mx-auto"key={labor.labor_id} >
                        <div className="card text-center m-4">
                            <div className="card-body">
                                
                            <Link to="/SeleccionarTrabajador"><h3 className="card-title text-uppercase text-primary" > {labor.labor_nombre} </h3> </Link>
                                
                                <p className="m-2">{labor.labor_descripcion}</p>

                            </div>
                        </div>
                    </div>

                ))}


            </div>
        </div>
    </Fragment >;

};

export default MostrarTrabajos;