import React, {Children, useActionState, useContext, useEffect, useState} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "../component/sidebar";
import { FormMain } from "../component/formMain";
import { Context } from "../store/appContext";
import { Default } from "./default";


export const Main = () => {
    const {store, actions} = useContext(Context)
    const[rutas, setRutas] = useState([])

    

    useEffect(()=>{
        if(store.ISOS){
            let urls =[]
            let dominios = actions.getParents()
            let subdominios = dominios.map((dominio) => actions.getChildren(dominio.id)).filter((child) => child.level != "Requerimiento")
            console.log(subdominios)
            let names = subdominios.map((subdominio) => subdominio.map((opt) => `${opt.level.toLowerCase()}-${opt.id}`))
            names.map((link) =>{
                urls.push(...link)
            })
            setRutas(urls)
        }
        },[store.ISOS])

    return (

        <div className="d-flex" style={{height:"100vh"}}>
            <Sidebar/>
            <div>
                <Routes>
                    {rutas && (
                        rutas.map((ruta, index) => {
                            let subDomainInfo = actions.getSubDomainInfo(ruta.split("-")[1])
                            return <Route path={`/project/${projectid}/${ruta}`} element={<FormMain info={subDomainInfo} key={`${ruta}-${index}`}/>}/>
                        }
                        )
                    )}
                    <Route  path="/" element={<Default/>}/>
                </Routes>
            </div>
        </div>
    )

}
