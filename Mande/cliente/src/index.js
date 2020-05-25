import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

//Browser router

import {BrowserRouter} from 'react-router-dom';
import StarRating from './components/starRating';
import ServicioTrabajador from './components/servicioTrabajador';
ReactDOM.render(<BrowserRouter>
  <React.StrictMode>
    <App/>
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
