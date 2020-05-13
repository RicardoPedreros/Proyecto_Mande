import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";



function Map () {

  return (
   <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 3.452980,
                       lng: -76.518784 }}
     >                  
      <Marker     
        position={{ lat: 3.376173, 
                     lng: -76.533501
          }}/> 


<InfoWindow
          onCloseClick={() => {
            
          }}
          position={{
            lat: 3.376173, 
            lng: -76.533501
          }}
        >
          <div>
            <h2> Univalle</h2>
            <p> tamo bien  </p>
          </div>
        </InfoWindow>



    </GoogleMap>


    
  );
}


const MapWrapped = withScriptjs(withGoogleMap(Map));

const ApiKey = 'AIzaSyBlrsTG-2asIIFS1wzn1UmPcaEn_MaStyo' ;

export default function Mapa() {
  return (
    <div style={{ width: "75vw", height: "90vh" }}>
      <MapWrapped
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${ApiKey}`}
            loadingElement={<p>   Cargando </p>}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}