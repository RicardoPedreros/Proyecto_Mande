import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import { Link } from "react-router-dom";


const usuario_celular = localStorage.getItem('celular_usuario')
const trabajador_documento = localStorage.getItem('trabajador_documento')
const labor_id = localStorage.getItem('labor_id')




function Map() {

  const [trabajador, setTrabajador] = useState([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [usuario, setUsuario] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);






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

      }



    } catch (err) {
      console.error(err.message)

    }
  };

  useEffect(() => {
    getUsuario();
    getTrabajador();
  }, []);



  return (
    <GoogleMap
      defaultZoom={9}
      defaultCenter={{
        lat: parseFloat(localStorage.getItem('latitud_usuario')),
        lng: parseFloat(localStorage.getItem('longitud_usuario'))
      }}
    >
      <Marker
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
        position={{
          lat: parseFloat(trabajador.trabajador_latitud),
          lng: parseFloat(trabajador.trabajador_longitud)
        }}
        onClick={() => {
          { console.log(usuario.usuario_nombre) }
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

export default function ServicioUsuario({setContratando}) {
  const [descripcion, setDescripcion] = useState("")
  const [disabledContratar, setDisabledContratar] = useState(false);


  function deshabilitar_1() {
    setDisabledContratar(!disabledContratar)
  }
  const Servicio = async (e) => {
    e.preventDefault(e)
    try {
      
      
      const body = { usuario: usuario_celular, trabajador: trabajador_documento, labor: labor_id, descripcion: descripcion }
      console.log(body);
      const response = await fetch("http://localhost:5000/Servicio",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body)
      })

    } catch (err) {
      console.log(err);

    }
  }

  const cancelarServicio = async(e) => {
    e.preventDefault();
    try {
      const body = {trabajador: trabajador_documento}
      const response = await fetch("http://localhost:5000/ServicioCancelar",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body)
      })
      console.log(response);

    } catch (err) {
      console.log(err);

    }

  }

 
  return (
    <form>
      <div className="container shadow-lg p-5 mb-4 bg-white rounded" style={{ width: "50vw", height: "200vh", border: "solid", borderBlockColor: "black", margin: "0 auto" }} >
        <div className="container p4 text-center">
          <h1 style={{ color: "#a02e2e", }}><b>Solicitud de Servicio</b></h1>
          <div className="mt-5 container   mb-4 bg-white rounded" style={{ width: "40vw", height: "150vh", border: "solid", borderBlockColor: "black", margin: "0 auto" }} >
            <div className="text-left">
              <h5 className="ml-4 mt-4 ">Descripción:</h5>
            </div>
            <div className="text-center">
              <input style={{ width: "35vw", height: "15vh", margin: "0 auto", border: "solid", borderBlockColor: "black", }} type="text" name="Descripcion" className="form-control mt-2 " onChange={e => setDescripcion(e.target.value)} required />
            </div>
            <MapWrapped

              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${ApiKey}`}
              loadingElement={<p>   Cargando </p>}
              containerElement={<div className="mt-5" style={{ width: "400px", height: `200px`, margin: "0 auto" }} />}
              mapElement={<div style={{ height: `200%`, margin: "0 auto", border: "solid", borderBlockColor: "black", }} />}

            />

            <div className="text-center">
              <button style={{ position: "absolute", left: "550px", top: "725px" }} className="btn btn-success mt-5"
                 disabled={disabledContratar} 
                onClick={e => { Servicio(e); deshabilitar_1(e) }}
              >Contratar</button>
            </div>
            <div className="text-center">
              <button style={{ position: "absolute", left: "700px", top: "725px" }} className="btn btn-danger mt-5"
              onClick={e=>{cancelarServicio(e)}}>Cancelar</button>
            </div>
            <div className="text-center">
              <Link to ="/UsuarioInicio" ><button style={{ position: "absolute", left: "640px", top: "775px" }} className="btn btn-warning mt-5"
              >Inicio</button></Link>
            </div>




          </div>

        </div>
      </div>
    </form>
  );
}