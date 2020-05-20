import React, { Fragment, useState } from "react";




const InputLaborNombre = () => {

    const [LaborNombre, setLaborNombre] = useState("")
    const [LaborDescripcion, setLaborDescripcion] = useState("")
    
    const onSubmmitForm = async e =>{
        e.preventDefault();
        try {
            const body = {labor_nombre: LaborNombre,labor_descripcion:LaborDescripcion};
            console.log(body);
            const response = await fetch("http://localhost:5000/Labor/Create",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                
                body: JSON.stringify(body)
                
            });
            console.log(response);
            
        } catch (err) {
            console.error(err.message);
            
            
            
        }
    }
    return (
        <Fragment>
            <h1 className="text-center mt-5">Registrar Labor</h1>

            <form className="d-flex mt-5" onSubmit={onSubmmitForm}>
                <input type="text" 
                className="form-control" 
                value={LaborNombre} 
                onChange={e => setLaborNombre(e.target.value)} />
                <input type="text" 
                className="form-control" 
                value={LaborDescripcion} 
                onChange={e => setLaborDescripcion(e.target.value)} />
                <button className="btn btn-success">Add</button>
            </form>

        </Fragment>
        
    )
}

export default InputLaborNombre;
