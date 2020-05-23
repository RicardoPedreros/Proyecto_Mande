import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
}
  from 'react-router-dom'
//components
import RegistrarUsuario from "./components/registrarUsuario"
import RegistrarTrabajador from "./components/registrarTrabajador"
import LoginUsuario from "./components/loginUsuario"
import ListLabores from './components/listLabor';
import MostrarTrabajos from './components/mostrarTrabajos';
import LoginTrabajador from './components/loginTrabajador';
import MostrarTrabajadores from './components/mostrarTrabajadores';
import Mapa from './components/mapa';


function App() {
  const [UsuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [TrabajadorAutenticado, setTrabajadorAutenticado] = useState(false);
  const [ContratandoTrabajador, setContratandoTrabajador] = useState(false);
  const [Servicio, setServicio] = useState(false);

  const setServ = (boolean) => {
    setServicio(boolean);
  }

  const setContratando = (boolean) => {
    setContratandoTrabajador(boolean);


  }

  const setAutUsuario = (boolean) => {
    setUsuarioAutenticado(boolean);
  }
  const setAutTrabajador = (boolean) => {
    setTrabajadorAutenticado(boolean);
  }

  async function estaAutenticadoUsuario() {
    try {
      const response = await fetch("http://localhost:5000/Autenticar/esta-verificado-usuario", {
        method: 'GET',
        headers: { token: localStorage.tokenUsuario }
      })
      const parseRES = await response.json();
      parseRES === true ? setUsuarioAutenticado(true) : setUsuarioAutenticado(false);

    } catch (error) {
      console.error(error.message);

    }
  }

  async function estaAutenticadoTrabajador() {
    try {
      const response = await fetch("http://localhost:5000/Autenticar/esta-verificado-trabajador", {
        method: 'GET',
        headers: { token: localStorage.tokenTrabajador }
      })
      const parseRES = await response.json();

      parseRES === true ? setTrabajadorAutenticado(true) : setTrabajadorAutenticado(false);

    } catch (error) {
      console.error(error.message);

    }
  }


  useEffect(() => {
    estaAutenticadoUsuario()
  })


  useEffect(() => {
    estaAutenticadoTrabajador()
  })


  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/EscogerLabor" render={props => (UsuarioAutenticado && !ContratandoTrabajador) ? (
              <MostrarTrabajos{...props} setContratando={setContratando} />) : (
                <Redirect to="/EscogerTabajador" />)} />

            <Route exact path="/EscogerTabajador" render={props => (UsuarioAutenticado && !Servicio) ? (
              <MostrarTrabajadores{...props} setServ={setServ} />) : (
                <Redirect to="/ServicioUsuario" />)} />

            <Route exact path="/ServicioUsuario" render={props => (UsuarioAutenticado) ? (
              <Mapa{...props}  />) : (
                <Redirect to="/" />)} />

            <Route exact path="/ListarLabores" render={props => UsuarioAutenticado ? (
              <ListLabores{...props} setAutUsuario={setAutUsuario} />) : (
                <Redirect to="/loginUsuario" />)} />


            <Route exact path="/RegistrarUsuario" render={props => !UsuarioAutenticado ? (
              <RegistrarUsuario{...props} setAutUsuario={setAutUsuario} />) : (
                <Redirect to="/EscogerLabor" />)} />


            <Route exact path="/RegistrarTrabajador" render={props => !TrabajadorAutenticado ? (
              <RegistrarTrabajador{...props} setAutTrabajador={setAutTrabajador} />) : (
                <Redirect to="/listLabor" />)} />


            <Route exact path="/loginUsuario" render={props => (!UsuarioAutenticado && !TrabajadorAutenticado && !ContratandoTrabajador) ? (
              <LoginUsuario{...props} setAutUsuario={setAutUsuario} />) : (
                <Redirect to="/EscogerLabor" />)} />


            <Route exact path="/loginTrabajador" render={props => (!UsuarioAutenticado && !TrabajadorAutenticado) ? (
              <LoginTrabajador{...props} setAutTrabajador={setAutTrabajador} />) :
              TrabajadorAutenticado ? (<Redirect to="/TrabajadorInicio" />) : (<Redirect to="/EscogerLabor" />)} />
          </Switch>

        </div>
      </Router>

    </Fragment>

  )
}

export default App;
