import React, { Fragment, useState } from "react";



function registrarUsuario() {
    return <Fragment>
        <div className="shadow-lg p-3 mb-5 bg-white rounded"></div>

        <div className="card ">

            <div className="d-flex justify-content-sm-center">
                <div className="signup-form-container ">
                    <form role="form" id="register-form" autoComplete="off">
                        <div className="form-header">
                            <h3 className="form-tittle">



                                Registro Usuario</h3>
                        </div>

                        <div className="form-body">
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <input name="name" type="text" className="form-control" placeholder="Nombre" required />

                                </div>
                                <div className="form-group col-md-6">
                                    <input name="apellido" type="text" className="form-control" placeholder="Apellido" required />
                                </div>
                            </div>


                            <div className="form-group">
                                <input type="text" name="email" className="form-control" placeholder="Email" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <input type="text" name="celular" className="form-control" placeholder="Celular" required />
                                </div>
                                <div className="form-group col-md-6">
                                    <input type="text" name="documento" className="form-control" placeholder="Documento" required />
                                </div>
                            </div>


                            <div className="form-group">
                                <input type="password" name="contraseña" className="form-control" placeholder="Contraseña" required />
                            </div>

                            <div className="form-group">
                                <input type="password" name="repetircontraseña" className="form-control" placeholder="Repetir contraseña" required />
                            </div>



                            <div className="form-group">
                                <div className="custom-file">
                                    <input type="file" name="Buscar" className="custom-file-input" id="customFileLang" lang="es" required />

                                    <label className="custom-file-label" htmlFor="customFileLang">Adjuntar Recibo</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label for="inputAddress"> Carrera/Calle</label>

                                        <input type="text" name="DireccionC" class="form-control" id="inputAddress"
                                            placeholder="Carrera" required />
                                    </div>




                                    <div class="form-group col-md-4">
                                        <label for="inputAddress"> Número</label>
                                        <input type="text" class="form-control" name="DireccionN" id="inputAddress"
                                            placeholder="7" required />
                                    </div>
                                    <div class="form-group col-md-4">

                                        <label for="inputAddress2"> Direccion secundaria</label>
                                        <input type="text" class="form-control" name="Direccion2" id="inputAddress2" placeholder="8-20"
                                            required />

                                    </div>
                                </div>


                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label for="inputCity">Comuna/Corregimiento</label>
                                        <input type="text" class="form-control" id="inputCity" name="Comuna_Corregimiento" required />
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="inputState">Ciudad</label>
                                        <input type="text" class="form-control" id="inputCity" name="Ciudad" required />

                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="inputZip">Departamento:</label>
                                        <input type="text" class="form-control" id="inputZip" name="Departamento" required />
                                    </div>
                                </div>








                                <div className="form-group">
                                    <div className="radio">
                                        <label><input type="radio" name="optradio" required />  Autorizo a mande el trato de mi información

                                            </label>

                                    </div>

                                </div>


                                <div className="row">
                                    <div className="col text-center">
                                        <button className="btn btn-primary">Registrarse</button>
                                    </div>


                                </div>

                            </div>


                        </div>


                    </form>

                </div>
            </div>
        </div>



    </Fragment>
}

export default registrarUsuario;