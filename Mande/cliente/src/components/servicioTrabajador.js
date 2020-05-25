import React, { useState, useEffect } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import { toast } from 'react-toastify'


const usuario_celular = localStorage.getItem('celular_usuario')
const trabajador_documento = localStorage.getItem('documento')
const labor_id = localStorage.getItem('labor_id')




function Map() {



    return (
        <GoogleMap
            defaultZoom={9}
            defaultCenter={{
                lat: parseFloat(localStorage.getItem('trabajador_latitud')),
                lng: parseFloat(localStorage.getItem('trabajador_longitud'))
            }}
        >
            <Marker
                position={{
                    lat: parseFloat(localStorage.getItem('usuario_latitud')),
                    lng: parseFloat(localStorage.getItem('usuario_longitud'))
                }}
                icon={{
                    url: `/usuario.png`,
                    scaledSize: new window.google.maps.Size(35, 35)
                }}
            />



            <Marker
                position={{
                    lat: parseFloat(localStorage.getItem('trabajador_latitud')),
                    lng: parseFloat(localStorage.getItem('trabajador_longitud'))
                }}
                icon={{
                    url: `/trabajador.png`,
                    scaledSize: new window.google.maps.Size(35, 35)
                }}
            />










        </GoogleMap>



    );



}


const MapWrapped = withScriptjs(withGoogleMap(Map));

const ApiKey = 'AIzaSyDtDvezVGJgaFMqa8FboBS4dcR6QKfnMyw';

export default function ServicioTrabajador({setTrabajadorContratado,setContratando}) {
    const [completo, setCompletoServicio] = useState(true);
    const [llegada, setLlegada] = useState(false);
    const [duracionServicio, setDuracionServicio] = useState();

    console.log(localStorage.getItem('descripcion'))
    const [descripcion, setdescripcion] = useState(localStorage.getItem('descripcion'));

    function Completado(e) {
        e.preventDefault();
        setCompletoServicio(!completo)
    }


    const servicioLlegada = async (e) => {
        e.preventDefault();
        setLlegada(!llegada)

        const body = { documento: trabajador_documento }

        const response = await fetch("http://localhost:5000/ServicioLlegada", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)


        })
        console.log(response);

    }


    const TerminarServicio = async (e) => {
        setContratando(false);
        e.preventDefault(e)

        const body = { documento: trabajador_documento, duracion: duracionServicio }

        const response = await fetch("http://localhost:5000/ServicioTerminado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)


        })

        console.log(response);
        setTrabajadorContratado(false);
        toast.success('Trabajo Concluido')
   



    }
    return (
        <div className="container shadow-lg p-5 mb-4 bg-white rounded" style={{ width: "50vw", height: "200vh", border: "solid", borderBlockColor: "black", margin: "0 auto" }} >
            <div className="container p4 text-center">
                <h1 style={{ color: "#a02e2e", }}><b>Se le asignó un servicio</b></h1>
                <div className="mt-5 container   mb-4 bg-white rounded" style={{ width: "40vw", height: "150vh", border: "solid", borderBlockColor: "black", margin: "0 auto" }} >
                    <div className="text-left">
                        <h5 className="ml-4 mt-4 ">Descripción:</h5>
                    </div>
                    
                    <div className="text-center">
                        <input style={{ width: "35vw", height: "15vh", margin: "0 auto", border: "solid", borderBlockColor: "black", }} type="text" name="Descripcion" className="form-control mt-2 " value={descripcion} disabled />
                    </div>
                    <label className="mt-2 mb-2" >Ubicacion: </label>
                    <MapWrapped

                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${ApiKey}`}
                        loadingElement={<p>   Cargando </p>}
                        containerElement={<div className="mt-5" style={{ width: "400px", height: `200px`, margin: "0 auto" }} />}
                        mapElement={<div style={{ height: `200%`, margin: "0 auto", border: "solid", borderBlockColor: "black", }} />}

                    />
                   


                    <div className="text-center">
                        <button style={{ position: "absolute", left: "500px", top: "825px" }} className="btn btn-success mt-5"
                            disabled={llegada}
                            onClick={e => { servicioLlegada(e); Completado(e) }}
                        >Llegó a su destino?</button>
                    </div>
                    <input style={{width:"5vw", height:"5vh", position: "absolute", left: "650px", top: "775px" }} type="number" name="Duracion" className="form-control mt-2 " onChange={e=>setDuracionServicio(e.target.value)} required />
                    <div className="text-center">
                        <button style={{ position: "absolute", left: "700px", top: "825px" }} className="btn btn-primary mt-5"
                            disabled={completo}
                            onClick={e => { TerminarServicio(e) }}>Completo Servicio?</button>
                    </div>






                </div>

            </div>
        </div>
    );
}