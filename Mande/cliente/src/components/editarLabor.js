import React, { Fragment, useState } from "react";

const EditarLabor = ({ labor }) => {
  const [LaborNombre, setLaborNombre] = useState(labor.labor_nombre);
  const [LaborDescripcion, setLaborDescripcion] = useState(labor.labor_descripcion);

  const updateLabor = async(e) =>{
    e.preventDefault();


    try {
      const body = {labor_id: labor.labor_id,labor_n: LaborNombre,labor_d:LaborDescripcion};
      
      const response = await fetch("http://localhost:5000/Labor/Edit",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body)
      })
      
    } catch (err) {
      console.error(err.message);
      
      
    }

  }
  return (
    <Fragment>

      <button type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${labor.labor_id}`}
        onClick={() =>{setLaborNombre(labor.labor_nombre);
          setLaborDescripcion(labor.labor_descripcion)}}
      >
        Editar
</button>


      <div className="modal"
        id={`id${labor.labor_id}`}
      >
        <div className="modal-dialog">
          <div className="modal-content">


            <div className="modal-header">
              <h4 className="modal-title">Editar Labor</h4>
              <button 
              type="button" 
              className="close" 
              data-dismiss="modal"
              onClick={() =>{setLaborNombre(labor.labor_nombre);
              setLaborDescripcion(labor.labor_descripcion)}}
              
              >
                &times;
              </button>
            </div>


            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={LaborNombre}
                onChange={e => setLaborNombre(e.target.value)} />
              <input
                type="text"
                className="form-control"
                value={LaborDescripcion}
                onChange={e => setLaborDescripcion(e.target.value)}
              />
            </div>


            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={e => updateLabor(e)}>
                Editar
                
                </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() =>{setLaborNombre(labor.labor_nombre);
                  setLaborDescripcion(labor.labor_descripcion)}}
                >
                Close
                </button>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default EditarLabor;