import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


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
      navigate(`/project/${projectId}`);
  };

  const handleAddProject = () => {
    navigate("/addproject");
};

    return (
      <div className="container">
          
          <h1 className="title">Tus Proyectos</h1>

          <button onClick={handleAddProject} className="floating-add-button">
            New Project
          </button>
        

          <div className="main-content">
           
            <button onClick={handleDeleteAllProjects} className="delete-all-button">Clear All</button>
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
                            <button onClick={() => handleDeleteProject(project.id)} className="delete-button">Eliminar</button>
                        </div>
                      ))
                  ) : (
                      <p>No hay proyectos disponibles.</p>
                  )}
              </div>
          </div>
      </div>
  );
};

