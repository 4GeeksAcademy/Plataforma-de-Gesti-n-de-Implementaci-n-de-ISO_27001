import React from "react";
import "../../styles/form.css";

export const FormRequiriment = ({requirement}) => {
   return (
    <div className="container1">
      <div className="container-low">
         <div className="col-12" style={{ display: "flex", alignItems: "center" }}>
            <h5 style={{ textAlign: "justify", margin: 0 }}>{requirement.title}</h5>

            <select
               className="form-select ms-5"
               aria-label="Default select example"
               defaultValue="1"
               style={{ height: "40px", width: "170px", borderRadius: "15px"}}
            >
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

      <div className="form-container">
         
         {/* Textareas */}
         <div className="row m-5">
            <div className="col-6 d-flex justify-content-center">
               <div className="w-100 custom-card">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Comentarios</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="8" placeholder="Escribe tus comentarios aquí "></textarea>
               </div>
            </div>
            <div className="col-6 d-flex justify-content-center">
               <div className="w-100 custom-card">
                  <label htmlFor="exampleFormControlTextarea2" className="form-label">Documentos</label>
                  <textarea className="form-control" id="exampleFormControlTextarea2" rows="6"></textarea>
                  <button type="button" className="btn btn-outline-primary col-4 mt-3">Seleccionar Archivo</button>
               </div>
            </div>
         </div>


        {/* Guardar */}
         <div className="row mb-3 justify-content-center">
            <button type="button" className="btn btn-save btn-outline-primary col-2 pt-2">Guardar</button>
         </div>
      </div>
    </div>
   );
};
