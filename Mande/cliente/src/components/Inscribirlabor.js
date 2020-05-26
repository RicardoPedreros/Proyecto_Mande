import React, { Fragment, useState, useEffect } from "react";
import DatosInscribirLabor from './datosInscribirLabor';
import { Link } from "react-router-dom";

const InscribirLabor = () => {
  
  const [trabajadorNombre, setTrabajadorNombre] = useState("");  
  const [labores, setLabores] = useState([]);


  const getTrabajador = async () => {
    try {
      const res = await fetch("http://localhost:5000/Autenticar/TrabajadorInicio/", {
        method: "POST",
        headers: { token: localStorage.tokenTrabajador }
      });

     
      const parseData = await res.json();
      
      console.log(parseData);
      setTrabajadorNombre((parseData.trabajador_nombre).toUpperCase());
  
    } catch (err) {
      console.error(err.message);
    }
  };


  const getLabores = async () => {
    try {

        const response = await fetch("http://localhost:5000/Labor/Listar");


        const jsonData = await response.json();


        setLabores(jsonData);

    } catch (err) {
        console.error(err.message)

    }
};

useEffect(() => {
    getTrabajador()
    getLabores()

}, [])



  console.log(labores);

  return (
    <Fragment>
      <h1>{trabajadorNombre} selecciona las labores en las que deseas inscribirte</h1>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Inscribir</th>
          </tr>
        </thead>
        <tbody>

            {labores.map(labor => (
              <tr key={labor.labor_id}>
                <td>{labor.labor_nombre}</td>
                <td>
                {labor.labor_descripcion}
                </td>
                <td>
 
                  <DatosInscribirLabor labor={labor}/>

                </td>
              </tr>
            ))}
        </tbody>
      </table>
            
      <Link to = "/TrabajadorInicio" ><button  className="ml-2 btn btn-primary"> Inicio </button></Link>
      

    </Fragment>
  );
};

export default InscribirLabor;