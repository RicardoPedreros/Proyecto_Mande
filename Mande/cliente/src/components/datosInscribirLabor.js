import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const DatosInscribirLabor = ({labor}) => {
    
    console.log(labor);

    const[laborNombre,setLaborNombre]=useState(labor.labor_nombre);
    const[laborID,setLaborID]=useState(labor.labor_id);
    const[laborPrecio,setLaborPrecio]=useState("");
    const[laborTipo,setLaborTipo]=useState("");

    
    const trabajadorRealizaLabor = async e => {
        e.preventDefault();
        try {
          const myHeaders = new Headers();

          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("token", localStorage.tokenTrabajador);
          
          
          
          const body = {laborID, laborTipo,laborPrecio };


          const response = await fetch(
            `http://localhost:5000/Autenticar/InscribirLaborTrabajador`,
            {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify(body)
            }
          );

          const parseResponse = await response.json();
          console.log("PARSERESPONSE");
          console.log(parseResponse);
    
          setLaborTipo("");
          setLaborPrecio("");


      if (parseResponse.trabajador_documento) {
        
        toast.success("Se inscribio en la labor exitosamente");
      } else {

        toast.error(parseResponse);
      }
  
          
        } catch (err) {
          console.error(err.message);
        }
      };
    


return (
    <Fragment>
    <button
      type="button"
      class="btn btn-warning"
      data-toggle="modal"
      data-target={`#id${labor.labor_id}`}
    >
      Inscribir
    </button>

    <div
      class="modal"
      id={`id${labor.labor_id}`}
     
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Inscribir labor: {laborNombre}</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              onClick={() => setLaborPrecio("")  }
               
            >
              &times;
            </button>
          </div>

          <div class="modal-body">
            <h10>Selecciona si cobraras por hora o por unidad</h10>
            <input
              type="text"
              className="form-control"
              value={laborTipo}
              onChange={e => setLaborTipo(e.target.value)}
              
            />
            <h10>Precio por unidad : </h10>
               <input
              type="text"
              className="form-control"
              value={laborPrecio}
              onChange={e => setLaborPrecio(e.target.value)}
              
            />
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              onClick={e => trabajadorRealizaLabor(e)}
             
            >
              Inscribir
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              onClick={() => setLaborPrecio("")  }
            >
             Cerrar 
            </button>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
)

}

export default DatosInscribirLabor;