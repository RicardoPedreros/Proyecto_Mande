import React from 'react';
import {Switch,Route} from 'react-router-dom';
import registrarUsuario from './components/registrarUsuario';
import RegistrarTrabajador from './components/registrarTrabajador';
import Mapa from './components/mapa';

const Routes = () =>{
   return(
       <Switch>
           <Route exact path= '/' component= {RegistrarTrabajador} />
           
           <Route exact path= '/mapa' component= {Mapa} />

       </Switch>
   );
}

export default Routes;