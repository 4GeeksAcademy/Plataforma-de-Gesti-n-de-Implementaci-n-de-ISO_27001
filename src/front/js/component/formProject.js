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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.createProject(projectName, companyName, projectDescription);

        if (success) {
            navigate("/projectlist"); // Redirigir a la lista de proyectos tras crear uno nuevo
        } else {
            setErrorMessage("Error al crear el proyecto. Verifica los datos ingresados.");
        }
    };

    return (
        <div className="container">
            <div className="left-container">
                <p className="text-center">
                    <img className="left-container-logo" src={Logo} />
                </p>
            </div>
            <div className="right-container">
                <h1 className="text-center">Register Project</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="projectName" className="form-label">Project Name</label>
                        <input type="text" className="form-control" id="projectName" placeholder="Enter Project Name" onChange={(e) => setProjectName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">Company Name</label>
                        <input type="text" className="form-control" id="companyName" placeholder="Enter Company Name" value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="projectDescription" className="form-label">Project Description</label>
                        <textarea type="textarea" className="form-control" id="projectDescription" placeholder="Enter Project Description" value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)} required />
                    </div>
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <button type="submit" className="btn">Register Project</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

