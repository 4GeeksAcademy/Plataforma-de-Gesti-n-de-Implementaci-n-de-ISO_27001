import React from "react";
import { FormRequiriment } from "./formRequirement";
import "../../styles/main.css";

export const FormMain = ({ info }) => {

   return (
      <div className="container0">
         {/* Título principal */}
         <div className="row" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div className="col-12 text-center">
               <h1 className="h1-custom">{info.dominio}</h1>
            </div>
         </div>


         {/* Subtítulo */}
         <div className="row subtitle">
            <div className="col-12 text-center">
               <h3 className="h3-custom">{info.subDominio}</h3>
            </div>
         </div>

         {/* Descripción del requerimiento */}
         <div className="row mb-3">
            <div className="col-12 text-start">
               <h5 className="h5-custom">
                  {info.requerimientos.map((requerimiento, index) =>{
                     return <FormRequiriment requirement={requerimiento} key={index+requerimiento.id}/>
                  })}

               </h5>
            </div>
         </div>
      </div>
   );
};
