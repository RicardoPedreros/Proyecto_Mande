import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import MostrarTrabajadores from "./mostrarTrabajadores";


const UsuarioInicio = ({setAutUsuario}) => {
  const [UsuarioNombre, setUsuarioNombre] = useState("");
  

  const getUsuario = async () => {
    try {
      const res = await fetch("http://localhost:5000/Autenticar/UsuarioInicio", {
        method: "POST",
        headers: { token: localStorage.tokenUsuario }
      });

     
      const parseData = await res.json();
      
      console.log(parseData);
      setUsuarioNombre((parseData.usuario_nombre).toUpperCase());
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("tokenUsuario");
      setAutUsuario(false);
      toast.success("Cerró sesión como Usuario");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUsuario();
  }, []);
  

  return (
    <div>
      <h1 className="mt-5">Usuario Inicio</h1>
      <h2>Bienvenido  {UsuarioNombre}</h2>
      <button onClick={e => logout(e)} className="btn btn-primary">
        Cerrar sesión
      </button>
      <Link to = "/EscogerLabor" ><button  className="ml-2 btn btn-primary"> Contratar Servicio </button></Link>
      
      <Link to = "/CalificarServicios" ><button  className="ml-2 btn btn-primary"> Calificar Servicios </button></Link>


    </div>
  );
};

export default UsuarioInicio;