import React, { Fragment, useEffect, useState } from "react";
import EditarLabor from "./editarLabor"


const ListLabores = () => {

    const [Labores, setLabores] = useState([]);

    //Delete Function

    const deleteLabor = async (id) => {
        try {
            const body = { labor_id: id };
            const deleteLabor = await fetch("http://localhost:5000/Labor/Delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            console.log(deleteLabor)
            setLabores(Labores.filter(labor => labor.labor_id !== id))
        } catch ({ err }) {
            console.error(err);

        }
    }


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
        getLabores();
    }, []);

    console.log(Labores);

    return <Fragment>
        <table className="table mt-5 text-center">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Editar</th>
                    <th>Borrar</th>
                </tr>
            </thead>
            <tbody>
                {/*<tr>
                    <td>John</td>
                    <td>Doe</td>
                    <td>john@example.com</td>
                </tr> */}
                {Labores.map(labor => (
                    <tr key={labor.labor_id}>
                        <td>
                            {labor.labor_nombre}
                        </td>
                        <td>
                            {labor.labor_descripcion}
                        </td>
                        <td>
                            <EditarLabor labor={labor} />
                        </td>
                        <td>
                            <button className="btn btn-danger"
                                onClick={() => deleteLabor(labor.labor_id)} >
                                Borrar
                            </button>
                        </td>

                    </tr>
                ))}


            </tbody>
        </table>
    </Fragment>;

};

export default ListLabores;