import React, { Fragment, useState } from "react";
import TrabajadorLogin from '../imagenes/LoginTrabajador.jpg'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function LoginTrabajador({ setAutTrabajador }) {

    const [trabajador_documento, setTrabajadorDocumento] = useState("");
    const [trabajador_password, setTrabajadorPassword] = useState("");


    const onSubmmitForm = async (e) => {
        const trabajador = { trabajador_documento: trabajador_documento, trabajador_password: trabajador_password }

        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/Autenticar/LoginTrabajador", {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(trabajador),

            });

            const parseRES = await response.json();

            if (parseRES.token) {
                localStorage.setItem("tokenTrabajador", parseRES.token);
                toast.success('Loggeo exitoso');
                setAutTrabajador(true)

            }




        } catch (err) {
            console.error(err);
            toast.error('Contraseña o Usuarios incorrectos')

        }
    }
    return (
        <Fragment>
            <div className="container shadow-lg p-5 mb-4 bg-white rounded">

                <div className="d-flex justify-content-sm-center">
                    <form className="d-flex mt-5" >


                        <div className="form-body">
                            <div className="form-header">
                                <h3 className="form-tittle mb-5"> Login Trabajador</h3>

                            </div>



                        </div>

                    </form>


                </div>

                <div className="container  p-5">
                    <div className="form-row" >

                        <div className="form-group col-md-6">
                            <img src={TrabajadorLogin} alt="Imagen" height="400" width="400" />
                        </div>
                        <div className="form-group col-md-6">
                            <div className="group ml-0 mb-2 mr-5 mt-2">
                                <label >Documento</label>
                                <input type="text" placeholder="3333333333" className="form-control" onChange={e => setTrabajadorDocumento(e.target.value)} required />

                                <label >Contraseña</label>
                                <input type="password" placeholder="" className="form-control" onChange={e => setTrabajadorPassword(e.target.value)} required />

                                <div className="col mt-3 text-center">

                                    <button type="button" className="btn btn-primary" onClick={(e) => { onSubmmitForm(e) }}>Ingresar</button>

                                </div>
                                <div className="col mt-3 text-center">
                                    <Link to="/RegistrarTrabajador">No tiene una cuenta? Registrese Aquí</Link>
                                </div>
                            </div>

                        </div>


                    </div>



                </div>

            </div>



        </Fragment >
    );

}

export default LoginTrabajador;