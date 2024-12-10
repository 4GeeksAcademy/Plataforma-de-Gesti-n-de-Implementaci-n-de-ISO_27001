import React, { useState } from 'react';

export const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="sidebar">
      <ul className="nav flex-column p-3">
        {/* 1. Contexto de la organización */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('contexto')}>
            4. Contexto de la organización
          </button>
          {/* Sub-secciones */}
          {openSection === 'contexto' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Contexto organizacional</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. Partes interesadas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">c. Alcance del SGSI</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">d. SGSI</a>
              </li>
            </ul>
          )}
        </li>

        {/* 2. Liderazgo */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('liderazgo')}>
            5. Liderazgo
          </button>
          {/* Sub-secciones */}
          {openSection === 'liderazgo' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Liderazgo & Compromiso</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. Políticas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">c. Roles, responsabilidades & autoridades en la organización</a>
              </li>
            </ul>
          )}
        </li>

        {/* 3. Planificación */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('planificacion')}>
            6. Planificación
          </button>
          {/* Sub-secciones */}
          {openSection === 'planificacion' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Acciones para tratar con los riesgos & oportunidades</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. Objetivos & planes de seguridad de la información</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">c. Planificación de cambios</a>
              </li>
            </ul>
          )}
        </li>

        {/* 4. Soporte */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('soporte')}>
            7. Soporte
          </button>
          {/* Sub-secciones */}
          {openSection === 'soporte' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Recursos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. Competencias</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">c. Concientización</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">d. Información documentada</a>
              </li>
            </ul>
          )}
        </li>

        {/* 5. Operación */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('operacion')}>
            8. Operación
          </button>
          {/* Sub-secciones */}
          {openSection === 'operacion' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Planificación y control operacional</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. Apreciación del riesgo de seguridad de la información</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">c. Tratamiento del riesgo de seguridad de la información</a>
              </li>
            </ul>
          )}
        </li>

        {/* 6. Evaluación del desempeño */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('evaluacion')}>
            9. Evaluación del desempeño
          </button>
          {/* Sub-secciones */}
          {openSection === 'evaluacion' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Seguimiento, medición, análisis y evaluación</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. Auditoría interna</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">c. Revisión por la dirección</a>
              </li>
            </ul>
          )}
        </li>

        {/* 7. Mejora */}
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={() => toggleSection('mejora')}>
            10. Mejora
          </button>
          {/* Sub-secciones */}
          {openSection === 'mejora' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a className="nav-link" href="#">a. Mejora continua</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">b. No conformidad y acciones correctivas</a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};
