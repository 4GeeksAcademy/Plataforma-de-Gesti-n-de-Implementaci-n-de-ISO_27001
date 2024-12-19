import React, { useState } from "react";
import "../../styles/form.css";

export const FormRequiriment = ({ requirement }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileUrls, setFileUrls] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);

        const urls = files.map(file => URL.createObjectURL(file));
        setFileUrls(urls);
    };

      const handleSave = async () => {
         const formData = new FormData();
         selectedFiles.forEach(file => {
            formData.append("files", file);
         });
   
         try {
            const response = await fetch(`/api/answers/${requirement.id}/uploadfiles`, {
               method: "PUT",
               headers: {
                     Authorization: `Bearer ${localStorage.getItem("token")}`
               },
               body: formData
            });
   
            const contentType = response.headers.get("content-type");
            
            if (!response.ok) {
               if (contentType && contentType.includes("application/json")) {
                     const errorData = await response.json();
                     alert(`Error: ${errorData.msg}`);
               } else {
                     const errorText = await response.text();
                     console.error("Respuesta inesperada del servidor:", errorText);
                     alert("Ocurrió un error inesperado. Revisa la consola para más detalles.");
               }
               return;
            }
   
            if (contentType && contentType.includes("application/json")) {
               const data = await response.json();
               alert("Archivos guardados exitosamente");
               setFileUrls(data.file_urls);
            } else {
               const successText = await response.text();
               console.warn("Respuesta inesperada del servidor (no JSON):", successText);
               alert("Archivos guardados, pero la respuesta del servidor no es JSON.");
            }
         } catch (error) {
            console.error("Error al guardar archivos: ", error);
            alert("Ocurrió un error al guardar los archivos.");
         }
   };
  

    return (
        <div className="container1">
            <div className="container-low">
                <div className="col-12" style={{ display: "flex", alignItems: "center" }}>
                    <h5 style={{ textAlign: "justify", margin: 0 }}>{requirement.title}</h5>

                    <select
                        className="form-select ms-5"
                        aria-label="Default select example"
                        defaultValue="1"
                        style={{ height: "40px", width: "170px", borderRadius: "15px" }}
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
                            <textarea
                                className="form-control"
                                id="exampleFormControlTextarea2"
                                rows="6"
                                value={fileUrls.join("\n")}
                                readOnly
                            ></textarea>
                            <input
                                type="file"
                                id="fileInput"
                                multiple
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-primary col-4 mt-3"
                                onClick={() => document.getElementById("fileInput").click()}
                            >
                                Seleccionar Archivo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Guardar */}
                <div className="row mb-3 justify-content-center">
                    <button type="button" className="btn btn-save btn-outline-primary col-2 pt-2" onClick={handleSave}>Guardar</button>
                </div>
            </div>
        </div>
    );
};
