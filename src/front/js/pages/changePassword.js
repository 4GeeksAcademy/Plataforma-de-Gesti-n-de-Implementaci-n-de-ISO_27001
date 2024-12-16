import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 


export const ChangePassword = () => {


  return (
    <div className="container">
      <h1>Cambiar Contraseña</h1>

      <form>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input type="password" id="newPassword"/>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input type="password" id="confirmPassword"/>
        </div>

        <button type="submit" className="btn btn-primary">
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};