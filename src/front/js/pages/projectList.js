import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/ProjectList.css";


export const ProjectList = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
      actions.getUserProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
          await actions.deleteProject(projectId);
          actions.getUserProjects();
      }
  };

  const handleDeleteAllProjects = async () => {
      if (window.confirm("¿Estás seguro de que deseas eliminar todos los proyectos?")) {
          await actions.deleteAllProjects();
          actions.getUserProjects();
      }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/main/${projectId}`);
  };

  const handleAddProject = () => {
    navigate("/addproject");
};

    return (
        <div style={{height: "100vh"}}>
            <div>
                <h1 className="h1-custom text-center" style={{borderEndStartRadius: "15px", borderEndEndRadius: "15px"}}>Tus Proyectos</h1>
            </div>
            <div className="big-container-project-list">
                <div>
                <button onClick={handleAddProject} style={{width: "210px", borderRadius: "15px"}} className="floating-add-button mt-3 text-center">
                    Nuevo Proyecto
                </button>
                </div>
                <div className="main-content">
                
                    <div className="project-list">
                        {store.projects && store.projects.length > 0 ? (
                            store.projects.map(project => (
                                <div key={project.id} className="project-item">
                                    <div className="project-info" onClick={() => handleProjectClick(project.id)}>
                                    <h2>{project.name}</h2>
                                    <p>Fecha de Inicio: {new Date(project.start_date).toLocaleDateString()}</p>
                                    <p>{project.description}</p>
                                    <p>Estado: {project.status}</p>                              
                                    </div>
                                    <button onClick={(e) =>{e.stopPropagation(); handleDeleteProject(project.id);}} className="delete-button">Eliminar</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No hay proyectos disponibles.</p>
                        )}
                    </div>
                </div>
                <div>
                    <button onClick={handleDeleteAllProjects} style={{width: "310px", borderRadius: "15px"}} className="delete-all-button mb-3">Eliminar todos los proyectos</button>
                </div>
            </div>
        </div>
  );
};

