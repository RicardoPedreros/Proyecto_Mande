import React from 'react';
import {Switch,Route} from 'react-router-dom';
import registrarUsuario from './components/registrarUsuario';

const Routes = () =>{
   return(
       <Switch>
           <Route exact path= '/' component= {registrarUsuario} />
       </Switch>
   );
}

export default Routes;