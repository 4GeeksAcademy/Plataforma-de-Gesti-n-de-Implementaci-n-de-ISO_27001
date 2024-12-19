import React, {Children, useActionState, useContext, useEffect, useState} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Sidebar } from "../component/sidebar";
import { FormMain } from "../component/formMain";
import { ManageProjectRoles } from "../component/ManageProjectRoles";
import { Context } from "../store/appContext";
import { Default } from "./default";
import "../../styles/main.css";


export const Main = () => {
    const { projectId } = useParams();
    const {store, actions} = useContext(Context);
    const[rutas, setRutas] = useState([]);
    const [projectResponses, setProjectResponses] = useState([]);
    console.log("Main.js - projectId:", projectId);


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
        {store.user?.id === store.projects?.find(project => project.id === parseInt(projectId))?.project_leader_id && (
            <div style={{ flex: "1", backgroundColor: "#f8f9fa", padding: "1rem", overflowY: "auto" }}>
                <ManageProjectRoles projectId={projectId} />
            </div>
        )}
        </div>
    )
}
