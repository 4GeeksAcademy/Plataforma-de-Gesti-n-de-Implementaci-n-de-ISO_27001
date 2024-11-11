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

    return (
      <div className="container">
          {store.user && <h2 className="user-name">Bienvenido, {store.user.full_name}</h2>}
          <h1 className="title">Tus Proyectos</h1>
          <div className="main-content">
              <button onClick={handleDeleteAllProjects} className="delete-all-button">Eliminar Todos</button>
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

