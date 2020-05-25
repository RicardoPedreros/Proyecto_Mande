import React, { Fragment, useState } from "react";
import UsuarioLogin from '../imagenes/LoginUsuario.jpeg'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function LoginUsuario({setAutUsuario }) {
    const [usuario_celular, setUsuarioCelular] = useState("");
    const [usuario_password, setUsuarioPassword] = useState("");
    

    const onSubmmitForm = async (e) => {
        const usuario = { usuario_celular, usuario_password }

        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/Autenticar/LoginUsuario", {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(usuario),

            });
            
            const parseRES = await response.json();

            if (parseRES.token) {
                console.log(parseRES.token);
                
                localStorage.setItem("tokenUsuario", parseRES.token);
                
                toast.success('Loggeo exitoso');
                setAutUsuario(true)

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
                                <h3 className="form-tittle mb-5"> Login Usuario</h3>

                            </div>



                        </div>

                    </form>


                </div>

                <div className="container  p-5">
                    <div className="form-row" >
                        <div className="form-group col-md-6">
                            <div className="group ml-0 mb-2 mr-5 mt-2">
                                <label >Celular</label>
                                <input type="text" placeholder="3333333333" className="form-control" onChange={e => setUsuarioCelular(e.target.value)} required />

                                <label >Contraseña</label>
                                <input type="password" placeholder="" className="form-control" onChange={e => setUsuarioPassword(e.target.value)} required />

                                <div className="col mt-3 text-center">

                                    <button type="button" className="btn btn-primary" onClick={(e) => { onSubmmitForm(e) }}>Ingresar</button>

                                </div>
                                <div className="col mt-3 text-center">
                                    <Link to="/RegistrarUsuario">No tiene una cuenta? Registrese Aquí</Link>
                                </div>
                            </div>

                        </div>
                        <div className="form-group col-md-6">
                            <img src={UsuarioLogin} alt="Imagen" height="400" width="400" />
                        </div>


                    </div>



                </div>

            </div>



        </Fragment >
    );

}

export default LoginUsuario;