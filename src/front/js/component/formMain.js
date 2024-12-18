import React from "react";
import { FormRequiriment } from "./formRequirement";


export const FormMain = ({ info, projectId, existingResponses }) => {
   if (!info || !info.dominio || !info.subDominio || !Array.isArray(info.requerimientos)) {
      return <div>Error: La información proporcionada no es válida.</div>;
  }


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
