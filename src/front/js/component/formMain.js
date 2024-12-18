import React from "react";
import { FormRequiriment } from "./formRequirement";


export const FormMain = ({ info, projectId, existingResponses }) => {
   if (!info || !info.dominio || !info.subDominio || !Array.isArray(info.requerimientos)) {
      return <div>Error: La información proporcionada no es válida.</div>;
  }


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
               {info.requerimientos.map((requerimiento, index) =>(
                  <FormRequiriment requirement={requerimiento} projectId={projectId}
                  existingResponse={existingResponses?.find(
                     (response) => response.subdomain_id === requerimiento.id
                 )}
                  key={index+requerimiento.id}/>
               ))}
            </div>
         </div>
         
      </div>
   );
};
