import React from 'react';
import {Switch,Route} from 'react-router-dom';
import registrarUsuario from './components/registrarUsuario';
import RegistrarTrabajador from './components/registrarTrabajador';
import Mapa from './components/mapa';
import Mapacomponente from './components/mapacomponente';

import InputLaborNombre from './components/inputLabor';
import ListLabores from './components/listLabor';


const Routes = () =>{
   return(
       <Switch>
           <Route exact path= '/' component= {RegistrarTrabajador} />
           <Route exact path= '/registrarusuario' component= {registrarUsuario} />
           
           <Route exact path= '/mapa' component= {Mapa} />
           <Route exact path= '/mapacomponente' component= {Mapacomponente} />

           <Route exact path= '/registrarlabor' component= {InputLaborNombre} />
           <Route exact path= '/listarbores' component= {ListLabores} />

       </Switch>
   );
}

export default Routes;