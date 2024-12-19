import React, {Children, useActionState, useContext, useEffect, useState} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Sidebar } from "../component/sidebar";
import { FormMain } from "../component/formMain";
import { ManageProjectRoles } from "../component/ManageProjectRoles";
import { Context } from "../store/appContext";
import { Default } from "./default";
import "../../styles/main.css";
import "../../styles/manageProjectRoles.css";

export const Main = () => {
    const { projectId } = useParams();
    const {store, actions} = useContext(Context);
    const[rutas, setRutas] = useState([]);
    const [projectResponses, setProjectResponses] = useState([]);
    const [isRolesVisible, setIsRolesVisible] = useState(false);
    const [isProjectLeader, setIsProjectLeader] = useState(false);


    useEffect(()=>{
        if(store.ISOS){
            let urls =[]
            let dominios = actions.getParents()
            let subdominios = dominios.map((dominio) => actions.getChildren(dominio.id)).filter((child) => child.level != "Requerimiento")
            console.log(subdominios)
            let names = subdominios.map((subdominio) => subdominio.map((opt) => `${opt.level.toLowerCase()}-${opt.id}`));
            
            names.forEach((link) =>{
                urls.push(...link)
            })
            setRutas(urls)
        }
        },[store.ISOS])

        useEffect(() => {
            let isMounted = true;

            if (projectId) {
                // Obtener respuestas del proyecto
                const loadResponses = async () => {
                    const responses = await actions.getProjectResponses(projectId);
                    if (isMounted) {
                        setProjectResponses(responses);
                    }
                };
                loadResponses();
            }

            return () => {
                isMounted = false; // Se ejecuta cuando el componente se desmonta
            };
            
        }, [projectId]);
        
        useEffect(() => {
            // Determinar si el usuario es jefe de proyecto
            const currentProject = store.projects?.find((project) => project.id === parseInt(projectId));
            const isLeader = store.user?.id === currentProject?.project_leader_id;
            setIsProjectLeader(isLeader);
        }, [store.user, store.projects, projectId]);
        
    return (

        <div className="d-flex"style={{ height: "100vh", width: "100vw", flexDirection: "row" }}>
            <Sidebar/>
            <div style={{ flex: "1" }}>
                <Routes>
                    {rutas && (
                        rutas.map((ruta, index) => {
                            let subDomainInfo = actions.getSubDomainInfo(ruta.split("-")[1]);
                            let responseData = projectResponses.find(
                                (response) => response.subdomain_id === parseInt(ruta.split("-")[1])
                            );
                            return <Route
                                key={`${ruta}-${index}`}
                                path={ruta}
                                element={
                                    <FormMain
                                        info={subDomainInfo}
                                        projectId={projectId}
                                        existingResponses={projectResponses}
                                     />
                                }
                            />
                        }
                        )
                    )}
                    <Route  path="/" element={<Default/>}/>
                </Routes>
            </div>
            {/* Componente de gestión de roles en la parte derecha */}
            {/* Renderizar solo si es el jefe del proyecto */}
            {isProjectLeader && (
                <>
                    <button
                        onClick={() => setIsRolesVisible(!isRolesVisible)}
                        className="floating-button"
                    >
                        {isRolesVisible
                            ? "Ocultar Gestión de Usuarios y Roles"
                            : "Mostrar Gestión de Usuarios y Roles"}
                    </button>

                    {isRolesVisible && (
                        <div className="floating-container">
                            <ManageProjectRoles projectId={projectId} />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
