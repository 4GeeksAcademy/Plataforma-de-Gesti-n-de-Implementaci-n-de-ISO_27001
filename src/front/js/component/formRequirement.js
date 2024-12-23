import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/form.css";

export const FormRequiriment = ({requirement, projectId, existingResponse}) => {
   const { actions } = useContext(Context);
   const [response, setResponse] = useState("Desconocido");
   const [comment, setComment] = useState("");
   const [selectedFiles, setSelectedFiles] = useState([]);
   const [fileUrls, setFileUrls] = useState([]);

   useEffect(() => {
      setResponse(existingResponse?.response || "Desconocido");
      setComment(existingResponse?.comment || "");
   }, [existingResponse]);
  
   const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      const urls = files.map(file => URL.createObjectURL(file));
      setFileUrls(urls);
   };

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

   const saveFile = async () => {
      if (!projectId) {
         console.error("Error: projectId está indefinido");
         return;
      }
      const fileUrl = await actions.saveProjectFile(projectId, selectedFiles);
   
      if (fileUrl) {
         setFileUrls([fileUrl]);
      }
   };
   return (
      <div className="container1">
         <div className="container-low">
            <div className="col-12" style={{ display: "flex", alignItems: "center" }}>
               <h5 style={{ textAlign: "justify", margin: 0 }}>{requirement.title}</h5>
               <select className="form-select ms-5" 
                  value={response} 
                  onChange={(e) => setResponse(e.target.value)} 
                  style={{ height: "40px", width: "170px", borderRadius: "15px" }}>
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
                     <textarea
                                 className="form-control"
                                 value={comment}
                                 onChange={(e) => setComment(e.target.value)}
                                 placeholder="Escribe tus comentarios aquí"
                                 id="exampleFormControlTextarea1"
                                 rows="8"
                     ></textarea>
                  </div>
               </div>
               <div className="col-6 d-flex justify-content-center">
                  <div className="w-100 custom-card">
                     <label htmlFor="exampleFormControlTextarea2" className="form-label">Documento de Respaldo</label>
                     <textarea className="form-control" id="exampleFormControlTextarea2" rows="6" value={fileUrls.join("\n")} readOnly></textarea>
                     <input type="file" id="fileInput" multiple style={{ display: "none" }} onChange={handleFileChange}></input>
                     <button style={{width: "200px"}} type="button" className="btn btn-outline-primary col-4 mt-3 me-2" onClick={() => document.getElementById("fileInput").click()}>Seleccionar Archivo</button>
                     <button style={{width: "200px"}} type="button" className="btn btn-outline-primary col-4 mt-3" onClick={saveFile}>Guardar Archivo</button>
                  </div>
               </div>
            </div>
            {/* Guardar */}
            <div className="row mb-3 justify-content-center">
               <button type="button" className="btn btn-save btn-outline-primary col-2 pt-2" onClick={saveResponse}>Guardar</button>
            </div>
         </div>

      </div>
   );
};
