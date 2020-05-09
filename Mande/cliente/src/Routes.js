import React from 'react';
import {Switch,Route} from 'react-router-dom'
import ListLabores from './components/listLabor';
import InputLaborNombre from './components/inputLabor';
import registrarUsuario from './components/registrarUsuario';
import registrarTrabajador from './components/registrarTrabajador';

const Routes = () =>{
   return(
       <Switch>
           <Route exact path= '/' component= {registrarUsuario} />
       </Switch>
   );
}

export default Routes;