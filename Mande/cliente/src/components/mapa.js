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


    const getTrabajadores = async () => {
        try {
            const response = await fetch("http://localhost:5000/Trabajador/Listar");


            const jsonData = await response.json();


            setTrabajadores(jsonData);

        } catch (err) {
            console.error(err.message)

        }
    };
    
    useEffect(() => {
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
          }}
          icon={{
            url: `/trabajador.png`,
            scaledSize: new window.google.maps.Size(35, 35)
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