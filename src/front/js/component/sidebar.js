import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';




export const Sidebar = ({opciones}) => {
  const {store, actions} = useContext(Context)
  const [mainOptions, setMainOptions] = useState([])
  const [openIndex, setOpenIndex] = useState({})
  
  const toggleSection = (name) => {
    setOpenIndex((prevState) => ({...prevState, [name]: !openIndex[name]}))

  };
  const renderOptions = (item, link=false) =>{
    let nombre = `${item.level.toLowerCase()}-${item.id}`
    let childrens = actions.getChildren(item.id).filter((child) => child.level != "Requerimiento")
    
    return (
      <li className="nav-item"  key={nombre}>
        <Link className={`nav-link`} to={link ? nombre: ""} onClick={() => toggleSection(nombre)}> 
        
      {item.title}
        </Link>

        {openIndex[nombre] && 
        (<div className='collapse show'  id={nombre}>
        <ol>{childrens?.map(child =>{
          return renderOptions(child, true)
        })}</ol>
        </div>)}
          
      </li>)
  }


useEffect(()=> {
  if(store.ISOS){
    setMainOptions(actions.getParents())
  }
},[store.ISOS])


  return (
    <div className="sidebar">
     <ol className="flex-column w-75 bg-light text-dark h-100 list-group">
      {mainOptions?.map(renderOptions)}
     </ol>
    </div>
  );
};
