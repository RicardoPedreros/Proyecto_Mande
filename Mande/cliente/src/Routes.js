import React from 'react';
import {Switch,Route} from 'react-router-dom';
import registrarUsuario from './components/registrarUsuario';
import RegistrarTrabajador from './components/registrarTrabajador';

const Routes = () =>{
   return(
       <Switch>
           <Route exact path= '/' component= {RegistrarTrabajador} />
       </Switch>
   );
}

export default Routes;