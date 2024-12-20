import React, { useState,  useContext } from 'react';
import Logo from "../../img/white-logo.png";
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";

export const FormProject = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [projectName, setProjectName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [startDate, setStartDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.createProject(projectName, companyName, projectDescription, startDate);

        if (success) {
            navigate("/projectlist"); // Redirigir a la lista de proyectos tras crear uno nuevo
        } else {
            setErrorMessage("Error al crear el proyecto. Verifica los datos ingresados.");
        }
    };

    return (
        <div className="big-div">
            <div className="left-div">
                <div className="left-div-logo text-center">
                    <img className="white-logo" src={Logo} />
                </div>
            </div>
            <div className="right-div">
                <div>
                    <h1 className="h3-custom text-center p-4" style={{borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px"}}>Registro de Proyecto</h1>
                </div>
                <div className="custom-card-password">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="projectName" className="form-label">Nombre del Proyecto</label>
                            <input type="text" className="form-control" id="projectName" placeholder="Escribe el nombre del proyecto aquí" onChange={(e) => setProjectName(e.target.value)} required />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="companyName" className="form-label">Nombre de la Compañía</label>
                            <input type="text" className="form-control" id="companyName" placeholder="Escribe el nombre de la compañía aquí" value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)} required />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="projectDescription" className="form-label">Descripción del Proyecto</label>
                            <textarea type="textarea" className="form-control" id="projectDescription" placeholder="Escribe la descripción del proyecto aquí" rows="3" value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)} required />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                id="startDate" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} 
                                required 
                            />
                        </div>
                        {errorMessage && (
                            <div className="alert alert-danger text-center mt-3">{errorMessage}</div>
                        )}
                        <div className="row justify-content-center mt-3">
                            <div className="col-auto">
                                <button type="submit" className="btn">Registar Proyecto</button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    );
};

