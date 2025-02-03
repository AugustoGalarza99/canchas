import React from "react";
import Administrativo from "../components/Administrativo/Administrativo";
import DemorasProfesionales from "../components/DemorasProfesional/DemorasProfesional";
import AccesoCodigos from "../components/AccesoCodigos/AccesoCodigos"
import GeneradorCodigo from "../components/GeneradorCodigo/GeneradorCodigo";

const Administracion = () => {
  return (
    <div>
        {/*<DemorasProfesionales />*/}
        <AccesoCodigos />
        <GeneradorCodigo />
        <Administrativo />
    </div>
  );
};

export default Administracion;