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
import ServicioUsuario from './components/ServicioUsuario';
import TrabajadorInicio from './components/trabajadorInicio';
import UsuarioInicio from './components/usuarioInicio';
import ServicioTrabajador from './components/servicioTrabajador';
import CalificarServicios from './components/calificarServicios';
import InscribirLabor from './components/Inscribirlabor';



function App() {
  const [UsuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [TrabajadorAutenticado, setTrabajadorAutenticado] = useState(false);
  const [ContratandoTrabajador, setContratandoTrabajador] = useState(false);
  const [servicioInfo, setServicioInfo] = useState([]);
  const [TrabajadorContratado, setTrabajadorContratado] = useState(false);
  const [Servicio, setServicio] = useState(false);
  const [ocupado,setOcupado] = useState(true);
  

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
  const setServProps = (info) =>{
    setServicioInfo(info);
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
  },[])


  useEffect(() => {
    estaAutenticadoTrabajador()
  },[])


  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
          <Route
              exact path="/TrabajadorInscribirLabor"
              render={props =>  TrabajadorAutenticado? (
                  <InscribirLabor {...props}  />
                ) : (
                  <Redirect to="/loginTrabajador" />
                )
              }
            />
            
          <Route
              exact path="/UsuarioInicio"
              render={props => UsuarioAutenticado ? (
                  <UsuarioInicio {...props} setAutUsuario={setAutUsuario}  />
                ) : (
                  <Redirect to="/loginUsuario" />
                )
              }
            />
            <Route
              exact path="/CalificarServicios"
              render={props => UsuarioAutenticado ? (
                  <CalificarServicios {...props} setAutUsuario={setAutUsuario}  />
                ) : (
                  <Redirect to="/loginUsuario" />
                )
              }
            />


          <Route exact path="/TrabajadorInicio" render={props => (TrabajadorAutenticado && !TrabajadorContratado) ? (
                  <TrabajadorInicio{...props} setAutTrabajador={setAutTrabajador} setServProps={setServProps} setTrabajadorContratado={setTrabajadorContratado}/>) :
                  !TrabajadorAutenticado ? <LoginTrabajador{...props} setAutTrabajador={setAutTrabajador} /> :(<Redirect to = {{pathname : "/servicioTrabajador", servicioInfo:servicioInfo} }/>)
                
              }
            />
            <Route exact path = "/servicioTrabajador" render = {props => (TrabajadorContratado) ? (
            <ServicioTrabajador{...props }setContratando={setContratando}  setTrabajadorContratado={setTrabajadorContratado}/> ) : (<Redirect to= "/TrabajadorInicio" />) } />

            <Route exact path="/EscogerLabor" render={props => (UsuarioAutenticado && !ContratandoTrabajador) ? (
              <MostrarTrabajos{...props} setContratando={setContratando} />) : (
                <Redirect to="/EscogerTabajador" />)} />

            <Route exact path="/EscogerTabajador" render={props => (UsuarioAutenticado && !Servicio) ? (
              <MostrarTrabajadores{...props} setServ={setServ} />) : (
                <Redirect to="/ServicioUsuario" setContratando={setContratando}/>)} />

            <Route exact path="/ServicioUsuario" render={props => (UsuarioAutenticado && ContratandoTrabajador) ? (
              <ServicioUsuario{...props} setServ={setServ}  setContratando={setContratando}/>) : (
                <Redirect to="/UsuarioInicio" />)} />

            <Route exact path="/ListarLabores" render={props => UsuarioAutenticado ? (
              <ListLabores{...props} setAutUsuario={setAutUsuario} />) : (
                <Redirect to="/loginUsuario" />)} />


            <Route exact path="/RegistrarUsuario" render={props => !UsuarioAutenticado ? (
              <RegistrarUsuario{...props} setAutUsuario={setAutUsuario} />) : (
                <Redirect to="/EscogerLabor" />)} />


            <Route exact path="/RegistrarTrabajador" render={props => !TrabajadorAutenticado ? (
              <RegistrarTrabajador{...props} setAutTrabajador={setAutTrabajador} />) : (
                <Redirect to="/TrabajadorInicio" />)} />


            <Route exact path="/loginUsuario" render={props => (!UsuarioAutenticado && !TrabajadorAutenticado && !ContratandoTrabajador) ? (
              <LoginUsuario{...props} setAutUsuario={setAutUsuario} />) : (
                <Redirect to="/EscogerLabor" />)} />


            <Route exact path="/loginTrabajador" render={props => (!UsuarioAutenticado && !TrabajadorAutenticado) ? (
              <LoginTrabajador{...props} setAutTrabajador={setAutTrabajador} />) :
              TrabajadorAutenticado ? (<Redirect to="/TrabajadorInicio" />) : (<Redirect to="/UsuarioInicio" />)} />


          </Switch>

        </div>
      </Router>

    </Fragment>

  )
}

export default App;
