import React from 'react';

export const Dominio = () => {

    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="rows-container">
                <div className="row mb-3">Contexto de la organización</div>
                <div className="row mb-3">Contexto Organizacional</div>
                <div className="row mb-3">Determinar los objetivos del SGSI de la organización y cualquier cuestión que pueda comprometer su efectividad</div>
                <div className="row mb-3">Fila 4</div>
                <select className="form-select" aria-label="Default select example">
                  <option selected>Desconocido</option>
                  <option value="1">Inexistente</option>
                  <option value="2">Inicial</option>
                  <option value="3">Limitado</option>
                  <option value="3">Definido</option>
                  <option value="3">Gestionado</option>
                  <option value="3">Optimizado</option>
                  <option value="3">No Aplica</option>
                </select>
                <div className="row mb-3">Fila 6</div>
                <div className="row mb-3">Fila 7</div>
              </div>
            </div>
          </div>
        </div>
      );
    };
