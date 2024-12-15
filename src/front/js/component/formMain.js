import React from "react";
import { FormRequiriment } from "./formRequirement";
export const FormMain = ({ info }) => {



   return (
      <div className="container-fluid justify-content-center">
         {/* Título principal */}
         <div className="row mb-3">
            <div className="col-12 text-center">
               <h1>{info.dominio}</h1>
            </div>
         </div>

         {/* Subtítulo */}
         <div className="row mb-3">
            <div className="col-12 text-center">
               <h3>{info.subDominio}</h3>
            </div>
         </div>

         {/* Descripción del requerimiento */}
         <div className="row mb-3">
            <div className="col-12 text-center">
               {info.requerimientos.map((requerimiento, index) =>{
                  return <FormRequiriment requirement={requerimiento} key={index+requerimiento.id}/>
               })}
            </div>
         </div>
         
      </div>
   );
};
