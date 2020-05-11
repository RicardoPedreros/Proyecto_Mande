import React, { Fragment, useState } from "react";



function registrarTrabajador() {
    return <Fragment>
        <div class="shadow-lg p-3 mb-5 bg-white rounded"></div>

        <div class="card ">

            <div class="d-flex justify-content-sm-center">
                <div class="signup-form-container ">
                    <form  id="register-form" autocomplete="off">
                        <div class="form-header">
                            <h3 class="form-tittle">



                                Registro Trabajador</h3>
                        </div>
                        <div class="form-body">
                            <div class="form-group">
                                <input name="name" type="text" class="form-control" placeholder="Nombre" />

                            </div>
                            <div class="form-group">
                                <input name="apellido" type="text" class="form-control" placeholder="Apellido" />
                            </div>
                            <div class="form-group">
                                <input type="text" name="email" class="form-control" placeholder="Email" />
                            </div>
                            <div class="form-group">
                                <input type="text" name="celular" class="form-control" placeholder="Celular" />
                            </div>
                            <div class="form-group">
                                <input type="text" name="documento" class="form-control" placeholder="Documento" />
                            </div>


                            <div class="form-group">
                                <input type="password" name="contraseña" class="form-control" placeholder="Contraseña" />
                            </div>

                            <div class="form-group">
                                <input type="password" name="repetircontraseña" class="form-control" placeholder="Repetir contraseña" />
                            </div>



                            <div class="form-group">
                                <div class="custom-file">
                                    <input type="file" name="Buscar" class="custom-file-input" id="customFileLang" lang="es" />

                                    <label class="custom-file-label" for="customFileLang">Adjuntar Foto de Documento</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="custom-file">
                                    <input type="file" name="Buscar" class="custom-file-input" id="customFileLang"
                                        lang="es" />
                                    <label class="custom-file-label" for="customFileLang">Adjuntar Foto de Perfil</label>


                                </div>

                                <div class="form-group">
                                    <div class="radio">
                                        <label><input type="radio" name="optradio" />  Autorizo a mande el trato de mi información

                                            </label>

                                    </div>

                                </div>


                                <div class="row">
                                    <div class="col text-center">
                                        <a href="/links/aplicarLabor" class="btn btn-primary">Registrarse</a>
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

export default registrarTrabajador;