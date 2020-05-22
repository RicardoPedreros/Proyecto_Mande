import React, { Fragment, useState } from "react";
import {toast} from 'react-toastify';


function RegistrarTrabajador({setAutTrabajador}) {

    const [trabajador_nombre, setTrabajadorNombre] = useState("")
    const [trabajador_apellido, setTrabajadorApellido] = useState("")
    const [trabajador_documento, setTrabajadorDocumento] = useState("")
    const [trabajador_password1, setTrabajadorPassword1] = useState("")
    //const [trabajador_password2, setTrabajadorPassword2] = useState("")
    const [trabajador_Car, setTrabajadorCar] = useState("")
    const [trabajador_CarN, setTrabajadorCarN] = useState("")
    const [trabajador_Dir2, setTrabajadorDir2] = useState("")
    const [trabajador_Com, setTrabajadorCom] = useState("")
    const [trabajador_ciudad, setTrabajadorCiudad] = useState("")
    const [trabajador_departamento, setTrabajadorDepartamento] = useState("")
    //const [trabajador_foto_perfil, SetTrabajadorFoto] = useState("")
    const [LatLng, setLatLng] = useState("");

    const onSubmmitForm = async e => {

        e.preventDefault();

        try {
            const trabajador_direccion = trabajador_Car + " " + trabajador_CarN + " " + trabajador_Dir2;

            const newTrabajador = {
                trabajador_documento: trabajador_documento,
                trabajador_nombre: trabajador_nombre,
                trabajador_apellido: trabajador_apellido,
                trabajador_foto_documento: '1',
                trabajador_foto_perfil: '1',
                trabajador_password: trabajador_password1,
                trabajador_latitud: LatLng.lat,
                trabajador_longitud: LatLng.lng,
                trabajador_comuna: trabajador_Com,
                trabajador_ciudad: trabajador_ciudad,
                trabajador_direccion: trabajador_direccion//trabajador_foto_perfil
            }
            console.log(JSON.stringify(newTrabajador))
            const response = await fetch("http://localhost:5000/Autenticar/RegistrarTrabajador", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(newTrabajador)

            });
            const parseRes = await response.json();

            if(parseRes.token){
                localStorage.setItem('tokenTrabajador', parseRes.token);
                setAutTrabajador(true);
                toast.success('Registro exitoso')

            }
            else {
                
            }
            

        } catch (err) {
            toast.error('Error: Este documento ya se encuentra registrado')
            console.error(err);


        }
    }


    const getLatLng = async e => {

        e.preventDefault();

        const direccion_formato = trabajador_Dir2 + ",+" + trabajador_Car + "+" + trabajador_CarN + ",+" + trabajador_Com + ",+" + trabajador_ciudad + ",+" + trabajador_departamento;
        const AP_KEY = 'AIzaSyDujuj4Ia2VIkcFVPFAajuUPLOmeVm4zUg';

        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + direccion_formato + '&key=' + AP_KEY);
            const data = await response.json();
            setLatLng(data.results[0].geometry.location);
        } catch (err) {
            console.error(err);


        }
    }



    return <Fragment>
        <div className="shadow-lg p-3 mb-5 bg-white rounded">





        </div>


        <div className="card ">
            <div className="d-flex justify-content-sm-center">
                <form className="d-flex mt-5" >

                    <div className="form-header">

                    </div><div className="form-body">
                        <h3 className="form-tittle"> Registro Trabajador</h3>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input name="name" type="text" className="form-control" placeholder="Nombre" onChange={e => setTrabajadorNombre(e.target.value)}
                                    required />

                            </div>
                            <div className="form-group col-md-6">
                                <input name="apellido" type="text" className="form-control" placeholder="Apellido" onChange={e => setTrabajadorApellido(e.target.value)}
                                    required />
                            </div>
                        </div>


                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <input type="text" name="documento" className="form-control" placeholder="Documento" onChange={e => setTrabajadorDocumento(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="form-group">
                            <input type="password" name="contraseña" className="form-control" placeholder="Contraseña" onChange={e => setTrabajadorPassword1(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <input type="password" name="repetircontraseña" className="form-control" placeholder="Repetir contraseña" /* onChange={e => setTrabajadorPassword2(e.target.value)}*/
                            />
                        </div>



                        <div className="form-group">

                        </div>


                        <div className="form-group">
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label > Carrera/Calle</label>

                                    <input type="text" name="DireccionC" className="form-control" onChange={e => setTrabajadorCar(e.target.value)}
                                        placeholder="Carrera"
                                    />
                                </div>




                                <div className="form-group col-md-4">
                                    <label> Número</label>
                                    <input type="text" className="form-control" name="DireccionN" onChange={e => setTrabajadorCarN(e.target.value)}
                                        placeholder="7"
                                    />
                                </div>
                                <div className="form-group col-md-4">

                                    <label > Direccion secundaria</label>
                                    <input type="text" className="form-control" name="Direccion2" placeholder="8-20" onChange={e => setTrabajadorDir2(e.target.value)}

                                    />

                                </div>
                            </div>


                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label >Comuna/Corregimiento</label>
                                    <input type="text" className="form-control" name="Comuna_Corregimiento" onChange={e => setTrabajadorCom(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Ciudad</label>
                                    <input type="text" className="form-control" id="inputCity" name="Ciudad" onChange={e => setTrabajadorCiudad(e.target.value)}
                                    />

                                </div>
                                <div className="form-group col-md-4">
                                    <label>Departamento:</label>
                                    <input type="text" className="form-control" name="Departamento" onChange={e => setTrabajadorDepartamento(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-5">
                                    <label >Latitud:</label>
                                    <input type="text"  disabled className="form-control" name="trabajador_latitud" value={LatLng.lat}
                                    />
                                </div>
                                <div className="form-group col-md-5">
                                    <label >Longitud:</label>
                                    <input type="text"
                                        disabled className="form-control" name="trabajador_longitud" value={LatLng.lng}

                                    />
                                </div>


                                <div className="form-group col-md-2">
                                    <label data-toggle="tooltip" title="Es obligatorio que genere su latitud y longitud">
                                        <h8>importante <i className="fa fa-question-circle d-inline"></i></h8>
                                    </label>
                                    <button className="btn btn-primary" onClick={e => getLatLng(e)}
                                        >
                                        Obtener
                                </button>
                                </div>



                            </div>








                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupFileAddon01">Subir</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile01"
                                            aria-describedby="inputGroupFileAddon01" />
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">Foto Documento</label>
                                    </div>

                                </div>

                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupFileAddon01">Subir</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile01"
                                            aria-describedby="inputGroupFileAddon01" />
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">Foto Trabajador</label>
                                    </div>

                                </div>

                            </div>
                            <div className="radio">
                                <label><input type="radio" name="optradio" />  Autorizo a mande el trato de mi información

                                        </label>

                            </div>

                            <div className="form-row">
                                <div className="col text-center"  >
                                    <button type="button" className="btn btn-primary" onClick={onSubmmitForm}>
                                        Registrarse </button>
                                </div>
                            </div>


                        </div>


                    </div>


                </form>

            </div>
        </div>

        



    </Fragment >
}

export default RegistrarTrabajador;