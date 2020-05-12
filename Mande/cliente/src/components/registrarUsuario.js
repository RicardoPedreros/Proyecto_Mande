import React, { Fragment, useState } from "react";






const RegistrarUsuario = () => {

    const [usuario_nombre, setUsuarioNombre] = useState("")
    const [usuario_apellido, setUsuarioApellido] = useState("")
    const [usuario_correo, setUsuarioCorreo] = useState("")
    const [usuario_celular, setUsuarioCelular] = useState("")
    const [usuario_documento, setUsuarioDocumento] = useState("")
    const [usuario_password1, setUsuarioPassword1] = useState("")
    const [usuario_password2, setUsuarioPassword2] = useState("")
    const [usuario_latitud, setUsuarioLatitud] = useState("");
    const [usuario_longitud, setUsuarioLongitud] = useState("");
    const [usuario_Car, setUsuarioCar] = useState("")
    const [usuario_CarN, setUsuarioCarN] = useState("")
    const [usuario_Dir2, setUsuarioDir2] = useState("")
    const [usuario_Com, setUsuarioCom] = useState("")
    const [usuario_ciudad, setUsuarioCiudad] = useState("")
    const [usuario_departamento, setUsuarioDepartamento] = useState("")
    const [LatLng, setLatLng] = useState("");
    const [usuario_numero_medio_pago, setUsuarioTarjeta] = useState("")


    const onSubmmitForm = async e => {

        e.preventDefault();

        try {
            const usuario_direccion = usuario_Car + " " + usuario_CarN + " " + usuario_Dir2 + " " + usuario_Com + " " + usuario_ciudad + " " + usuario_departamento;

            const newUsuario = {
                usuario_nombre: usuario_nombre,
                usuario_apellido: usuario_apellido,
                usuario_correo: usuario_correo,
                usuario_celular: usuario_celular,
                usuario_direccion: usuario_direccion,
                usuario_documento: usuario_documento,
                usuario_password: usuario_password1,
                usuario_latitud: LatLng.lat,
                usuario_longitud: LatLng.lng,
                usuario_numero_medio_pago: usuario_numero_medio_pago,
                usuario_tipo_medio_pago: '1',
                usuario_foto_recibo: '1'
            }
            console.log(newUsuario)
            console.log(JSON.stringify(newUsuario))
            const response = await fetch("http://localhost:5000/Usuario/Create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(newUsuario)

            });

            console.log(response);

        } catch (err) {
            console.error(err);


        }

    }
    const getLatLng = async e => {

        e.preventDefault();

        const direccion_formato = usuario_Dir2 + ",+" + usuario_Car + "+" + usuario_CarN + ",+" + usuario_Com + ",+" + usuario_ciudad + ",+" + usuario_departamento;
        const AP_KEY = 'AIzaSyDujuj4Ia2VIkcFVPFAajuUPLOmeVm4zUg';

        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + direccion_formato + '&key=' + AP_KEY);
            const data = await response.json();
            const Latitud = data.results[0].geometry.location.lat
            const Longitud = data.results[0].geometry.location.lng
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
                <form className="d-flex mt-5"  >

                    <div className="form-header">

                    </div><div className="form-body">
                        <h3 className="form-tittle"> Registro Usuario</h3>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input name="name" type="text" className="form-control" placeholder="Nombre"
                                    onChange={e => setUsuarioNombre(e.target.value)} required />

                            </div>
                            <div className="form-group col-md-6">
                                <input name="apellido" type="text" className="form-control" placeholder="Apellido"
                                    onChange={e => setUsuarioApellido(e.target.value)} required />
                            </div>
                        </div>


                        <div className="form-group">
                            <input type="text" name="email" className="form-control" placeholder="Email"
                                onChange={e => setUsuarioCorreo(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input type="text" name="celular" className="form-control" placeholder="Celular"
                                    onChange={e => setUsuarioCelular(e.target.value)} />
                            </div>
                            <div className="form-group col-md-6">
                                <input type="text" name="documento" className="form-control" placeholder="Documento"
                                    onChange={e => setUsuarioDocumento(e.target.value)} />
                            </div>
                        </div>


                        <div className="form-group">
                            <input type="password" name="contraseña" className="form-control" placeholder="Contraseña"
                                onChange={e => setUsuarioPassword1(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <input type="password" name="repetircontraseña" className="form-control" placeholder="Repetir contraseña"
                                onChange={e => setUsuarioPassword2(e.target.value)} />
                        </div>



                        <div className="form-group">

                        </div>


                        <div className="form-group">
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label > Carrera/Calle</label>

                                    <input type="text" name="DireccionC" className="form-control"
                                        placeholder="Carrera"
                                        onChange={e => setUsuarioCar(e.target.value)} />
                                </div>




                                <div className="form-group col-md-4">
                                    <label> Número</label>
                                    <input type="text" className="form-control" name="DireccionN"
                                        placeholder="7"
                                        onChange={e => setUsuarioCarN(e.target.value)} />
                                </div>
                                <div className="form-group col-md-4">

                                    <label > Direccion secundaria</label>
                                    <input type="text" className="form-control" name="Direccion2" placeholder="8-20"

                                        onChange={e => setUsuarioDir2(e.target.value.replace('-', '+'))} />

                                </div>
                            </div>


                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label >Comuna/Corregimiento</label>
                                    <input type="text" className="form-control" name="Comuna_Corregimiento"
                                        onChange={e => setUsuarioCom(e.target.value.replace(' ', '+'))} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Ciudad</label>
                                    <input type="text" className="form-control" id="inputCity" name="Ciudad"
                                        onChange={e => setUsuarioCiudad(e.target.value.replace(' ', '+'))} />

                                </div>
                                <div className="form-group col-md-4">
                                    <label>Departamento:</label>
                                    <input type="text" className="form-control" name="Departamento"
                                        onChange={e => setUsuarioDepartamento(e.target.value.replace(/[ ]/g, '+'))} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-5">
                                    <label >Latitud:</label>
                                    <input type="text" defaultValue={LatLng.lat} disabled className="form-control" name="usuario_latitud" value={LatLng.lat}
                                    />
                                </div>
                                <div className="form-group col-md-5">
                                    <label >Longitud:</label>
                                    <input type="text"
                                        defaultValue={LatLng.lng} disabled className="form-control" name="usuario_longitud" value={LatLng.lng}

                                    />
                                </div>


                                <div className="form-group col-md-2">
                                    <label data-toggle="tooltip" title="Es obligatorio que genere su latitud y longitud">
                                        <h8>importante <i className="fa fa-question-circle d-inline"></i></h8>
                                    </label>
                                    <button className="btn btn-primary"
                                        onClick={e => getLatLng(e)} >
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
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">Foto recibo</label>
                                    </div>
                                </div>

                            </div>
                            <div className="radio">
                                <label><input type="radio" name="optradio" />  Autorizo a mande el trato de mi información

                                            </label>

                            </div>

                            <div className="form-row">
                                <div className="col text-center"  >
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                                        Agregar Medio de Pago </button>
                                </div>
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



        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Registrar Medio de pago</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        {/*CREDIT CARD*/}
                        <container>
                            <div className="d-flex justify-content-center">
                                <i className="fas fa-credit-card fa-4x centering"></i>

                            </div>

                            <div className="d-flex justify-content-center form-group">
                                <h3>Tarjeta de Crédito/Débito</h3>
                            </div>

                            <div className="form-row">

                                <div className="form-group col-md-12">
                                    <label>Numero tarjeta</label>
                                    <input id="ccn" type="credit-card" inputMode="numeric" className="form-control" pattern="[0-9\s]{13,19}" maxLength="19"
                                        onChange={e => setUsuarioTarjeta(e.target.value.replace(' ', '+'))} />


                                </div>

                            </div>
                            <div className="form-row">

                                <div className="form-group col-md-6">
                                    <label> Fecha de Vencimiento </label>
                                    <input type="Month" placeholder="MM-AA" className="form-control" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>  CVC  </label>
                                    <input type="text" className="form-control" placeholder="NNN"></input>
                                </div>




                            </div>

                        </container>




                        {/*CREDIT CARD*/}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-dismiss="modal">Agregar</button>

                    </div>
                </div>
            </div>
        </div>




    </Fragment >
}

export default RegistrarUsuario;