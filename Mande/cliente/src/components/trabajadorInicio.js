import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TrabajadorInicio = ({ setAutTrabajador, setServProps, setTrabajadorContratado }) => {
  const [trabajadorNombre, setTrabajadorNombre] = useState("");
  const [trabajadorDocumento, setTrabajadorDocumento] = useState("");


  const getTrabajador = async () => {
    try {
      const res = await fetch("http://localhost:5000/Autenticar/TrabajadorInicio/", {
        method: "POST",
        headers: { token: localStorage.tokenTrabajador }
      });


      const parseData = await res.json();
      if (parseData) {
        setTrabajadorNombre((parseData.trabajador_nombre).toUpperCase());
        setTrabajadorDocumento(parseData.trabajador_documento)

        localStorage.setItem('trabajador_latitud', parseData.trabajador_latitud)
        localStorage.setItem('trabajador_longitud', parseData.trabajador_longitud)
        localStorage.setItem('servicio_descripcion', parseData.servicio_descripcion)
        
      }


    } catch (err) {
      console.error(err.message);
    }
  };




  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("tokenTrabajador");
      setAutTrabajador(false);
      toast.success("Cerró sesión como trabajador");
    } catch (err) {
      console.error(err.message);
    }
  };

  const tieneTrabajo = async () => {
    try {
      const body = { documento: localStorage.getItem('documento') }

      const response = await fetch("http://localhost:5000/ServicioAsignado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(body)
      })
      const jsonData = await response.json();
      console.log(jsonData);
      


      setServProps([])

      if (jsonData.rowCount == 1) {
        const info = await jsonData.rows[0];

        const { labor_id, usuario_celular,usuario_latitud,usuario_longitud,servicio_descripcion} = info;
        localStorage.setItem('celular_usuario', usuario_celular)
        localStorage.setItem('labor_id', labor_id)
        localStorage.setItem('usuario_latitud', usuario_latitud)
        localStorage.setItem('usuario_longitud', usuario_longitud)
        localStorage.setItem('descripcion',servicio_descripcion)


        setServProps(jsonData.rows[0])
        setTrabajadorContratado(true);

      }


    } catch (error) {
      console.error(error.message);

    }
  }


  useEffect(() => {
    tieneTrabajo();
  })

  useEffect(() => {
    getTrabajador();

  });

  return (
    <div>
      <h1 className="mt-5">Trabajador Inicio</h1>
      <h2>Bienvenido  {trabajadorNombre}</h2>

      <button onClick={e => logout(e)} className="btn btn-primary">
        Cerrar sesión
      </button>
    </div>
  );
};

export default TrabajadorInicio;