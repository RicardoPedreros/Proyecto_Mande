import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";



function Map() {

  const [trabajador, setTrabajador] = useState([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [usuario, setUsuario] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const usuario_celular = localStorage.getItem('usuario_celular')
  const trabajador_documento = localStorage.getItem('trabajador_documento')
  const [latitud,setLatitud] = useState('');
  const [longitud,setLongitud] = useState('');
  



   const getTrabajador = async () => {
    try {
      const body = { trabajador_documento: trabajador_documento }
      const response = await fetch("http://localhost:5000/InformacionTrabajador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)

      });


      const jsonData = await response.json();


      if (jsonData) {
        setTrabajador(jsonData.rows[0]);
        
        console.log(trabajador);
        

      }



    } catch (err) {
      console.error(err.message)

    }
  };


 

  const getUsuario = async () => {
    try {
      const body = { usuario_celular: usuario_celular }
      const response = await fetch("http://localhost:5000/informacionUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)

      });


      const jsonData = await response.json();


      if (jsonData) {
        setUsuario(jsonData.rows[0]);
        setLatitud(jsonData.rows[0].usuario_latitud);
        setLongitud(jsonData.rows[0].usuario_longitud);
        

      }



    } catch (err) {
      console.error(err.message)

    }
  };

  useEffect(() => {
    getUsuario();
    getTrabajador();
  },[]);



  return (
    <GoogleMap
      defaultZoom={9}
      defaultCenter={{
        lat: parseFloat(localStorage.getItem('latitud_usuario')),
        lng: parseFloat(localStorage.getItem('longitud_usuario'))
      }}
    >
      <Marker
        key={usuario.usuario_celular}
        position={{
          lat: parseFloat(usuario.usuario_latitud),
          lng: parseFloat(usuario.usuario_longitud)
        }}
        onClick={() => {
          
          setSelectedTrabajador(null);
          setSelectedUsuario(usuario);
        }}
        icon={{
          url: `/usuario.png`,
          scaledSize: new window.google.maps.Size(35, 35)
        }}
      />



      <Marker
        key={trabajador.trabajador_documento}
        position={{
          lat: parseFloat(trabajador.trabajador_latitud),
          lng: parseFloat(trabajador.trabajador_longitud)
        }}
        onClick={() => {
          {console.log(usuario.usuario_nombre)}
          setSelectedTrabajador(trabajador);
          setSelectedUsuario(null);
        }}
        icon={{
          url: `/trabajador.png`,
          scaledSize: new window.google.maps.Size(35, 35)
        }}
      />





      {selectedTrabajador &&
        <InfoWindow
          position={{
            lat: parseFloat(selectedTrabajador.trabajador_latitud),
            lng: parseFloat(selectedTrabajador.trabajador_longitud)
          }}
          onCloseClick={() => {
            setSelectedTrabajador(null);

          }}
        >
          <div>
            <h5>Trabajador</h5>
            <p> Nombre: {selectedTrabajador.trabajador_nombre}</p>
          </div>
        </InfoWindow>
      }


      {selectedUsuario &&
        <InfoWindow
          position={{
            lat: parseFloat(selectedUsuario.usuario_latitud),
            lng: parseFloat(selectedUsuario.usuario_longitud)
          }}
          onCloseClick={() => {
            setSelectedUsuario(null);

          }}
        >
          <div>
            <h5>Usuario</h5>
            <p> Nombre: {selectedUsuario.usuario_nombre}</p>
          </div>
        </InfoWindow>
      }






    </GoogleMap>



  );



}


const MapWrapped = withScriptjs(withGoogleMap(Map));

const ApiKey = 'AIzaSyDtDvezVGJgaFMqa8FboBS4dcR6QKfnMyw';

export default function Mapa() {
  return (
    <div style={{ width: "40vw", height: "10vh" }}>
      MAPA MANDE
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${ApiKey}`}
        loadingElement={<p>   Cargando </p>}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}