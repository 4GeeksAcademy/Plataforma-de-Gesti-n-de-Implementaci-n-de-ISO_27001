import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

export const FormRequiriment = ({requirement, projectId, existingResponse}) => {
   const { actions } = useContext(Context);
   const [response, setResponse] = useState("Desconocido");
   const [comment, setComment] = useState("");

   useEffect(() => {
      setResponse(existingResponse?.response || "Desconocido");
      setComment(existingResponse?.comment || "");
  }, [existingResponse]);
  

   const saveResponse = async () => {
      if (!projectId) {
          console.error("Error: projectId está indefinido");
          return;
      }
  
      try {
          const success = await actions.saveProjectResponse(projectId, requirement.id, response, comment);
          if (success) alert("Respuesta guardada correctamente");
      } catch (error) {
          console.error("Error al guardar la respuesta:", error);
      }
  };
  console.log("FormRequirement.js - projectId:", projectId);

   return (
    <div>
        <h5>{requirement.title}</h5>
      <div className="container-fluid justify-content-center">
         {/* Selector desplegable */}
         <div className="row mb-3">
            <div className="col-12 d-flex justify-content-center">
               <select className="form-select" 
                  /*aria-label="Default select example"*/
                  value={response} 
                  onChange={(e) => setResponse(e.target.value)} 
                  style={{ maxWidth: "300px" }}>
                  <option value="1">Desconocido</option>
                  <option value="2">Inexistente</option>
                  <option value="3">Inicial</option>
                  <option value="4">Limitado</option>
                  <option value="5">Definido</option>
                  <option value="6">Gestionado</option>
                  <option value="7">Optimizado</option>
                  <option value="8">No Aplica</option>
               </select>
            </div>
         </div>

         {/* Textareas */}
         <div className="row mb-3">
            <div className="col-6 d-flex justify-content-center">
               <div className="w-100">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Comentarios</label>
                  <textarea
                            className="form-control"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                  ></textarea>
               </div>
            </div>
            <div className="col-6 d-flex justify-content-center">
               <div className="w-100">
                  <label htmlFor="exampleFormControlTextarea2" className="form-label">Lista de documentos</label>
                  <textarea className="form-control" id="exampleFormControlTextarea2" rows="3"></textarea>
                  <button className="btn btn-primary" onClick={saveResponse}>
                    Guardar
                  </button>
               </div>
            </div>
         </div>
        {/* Subir Archivo */}
            <div className="row mb-3">
                <div className="col-6 text-center">
                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                        <button type="button" className="btn btn-outline-primary">Subir</button>
                    </div>
                </div>
                <div className="col-6 text-center">
                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                        <button type="button" className="btn btn-outline-primary">Guardar</button>
                    </div>
                </div>
            </div>
      </div>
    </div>
   );
};
