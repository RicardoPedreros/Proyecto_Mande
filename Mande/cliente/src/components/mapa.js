import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";



function Map () {

    const [trabajadores, setTrabajadores] = useState([]);
    const [selectedTrabajador, setSelectedTrabajador] = useState(null);

    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);


    const getTrabajadores = async () => {
        try {
            const response = await fetch("http://localhost:5000/Trabajador/Listar");


            const jsonData = await response.json();


            setTrabajadores(jsonData);

        } catch (err) {
            console.error(err.message)

        }
    };
    
 

    const getUsuarios = async () => {
      try {
          const response = await fetch("http://localhost:5000/Usuario/Listar");


          const jsonData = await response.json();


          setUsuarios(jsonData);

      } catch (err) {
          console.error(err.message)

      }
  };
  
  useEffect(() => {
     getUsuarios ();
     getTrabajadores(); 
  }, []);
    
  

  return (
   <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 3.418156,
                       lng: -76.526865 }}
     >    
           



     {trabajadores.map(trabajador => (   
       
      <Marker    
        key = {trabajador.trabajador_documento}
        position={{ lat:  parseFloat(trabajador.trabajador_latitud),
                    lng:  parseFloat(trabajador.trabajador_longitud)
        }}
        onClick={() => {
            setSelectedTrabajador(trabajador);
            setSelectedUsuario(null);
          }}
          icon={{
            url: `/trabajador.png`,
            scaledSize: new window.google.maps.Size(35, 35)
          }}
                     />

                     ))}


    {usuarios.map(usuario => (   
       
       <Marker    
         key = {usuario.usuario_documento}
         position={{ lat:  parseFloat(usuario.usuario_latitud),
                     lng:  parseFloat(usuario.usuario_longitud)
         }}
         onClick={() => {
             setSelectedUsuario(usuario);
             setSelectedTrabajador(null);
           }}
           icon={{
             url: `/usuario.png`,
            scaledSize: new window.google.maps.Size(25, 30)
           }}

                      />
 
                      ))}


     
      {selectedTrabajador && 
        <InfoWindow
          position={{
            lat:  parseFloat(selectedTrabajador.trabajador_latitud),
            lng:  parseFloat(selectedTrabajador.trabajador_longitud)
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
        lat:  parseFloat(selectedUsuario.usuario_latitud),
        lng:  parseFloat(selectedUsuario.usuario_longitud)
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

const ApiKey = 'AIzaSyBlrsTG-2asIIFS1wzn1UmPcaEn_MaStyo' ;

export default function Mapa() {
  return (
    <div style={{ width: "75vw", height: "90vh" }}>
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