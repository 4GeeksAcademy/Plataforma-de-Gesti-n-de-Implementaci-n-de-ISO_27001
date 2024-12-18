import React, { useState } from "react";

export const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    const token = "el_token_de_autenticación";
    const result = await changePassword(currentPassword, newPassword, confirmPassword, token);
    if (result) {
      setSuccessMessage("Contraseña cambiada con éxito.");
      setErrorMessage("");
    } else {
      setSuccessMessage("");
      setErrorMessage("Hubo un error al cambiar la contraseña.");
    }
  };

  return (
    <div className="container">
      <h1>Cambiar Contraseña</h1>

      {/* Mostrar mensajes de error o éxito */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};
