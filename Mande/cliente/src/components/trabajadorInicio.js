import React, { useEffect, useState } from "react";


const TrabajadorInicio = ({ setAuth }) => {
  const [trabajadorNombre, setTrabajadorNombre] = useState("");
  

  const getTrabajador = async () => {
    try {
      const res = await fetch("http://localhost:5000/Autenticar/TrabajadorInicio/", {
        method: "POST",
        headers: { token: localStorage.tokenTrabajador }
      });

     
      const parseData = await res.json();
      
      console.log(parseData);
      setTrabajadorNombre(parseData.trabajador_nombre);
  
    } catch (err) {
      console.error(err.message);
    }
  };
/*
  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };
*/
  useEffect(() => {
    getTrabajador();
  }, []);

  return (
    <div>
      <h1 className="mt-5">Trabajador Inicio</h1>
      <h2>Bienvenido {trabajadorNombre}</h2>

    </div>
  );
};

export default TrabajadorInicio;