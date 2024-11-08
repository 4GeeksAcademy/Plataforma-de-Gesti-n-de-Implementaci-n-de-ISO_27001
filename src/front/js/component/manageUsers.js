import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Logo from "../../img/white-logo.png";
import "../../styles/adminRegister.css";

export const ManageUsers = () => {
    const { store, actions } = useContext(Context);

    // Estado para almacenar los roles seleccionados para cada usuario
    const [selectedRoles, setSelectedRoles] = useState({});

    useEffect(() => {
        actions.getAllUsers();
        actions.getAllRoles();
    }, []);

    // Función para manejar el cambio de rol en el select
    const handleRoleChange = (userId, newRole) => {
        setSelectedRoles({
            ...selectedRoles,
            [userId]: newRole
        });
    };

    // Función para guardar el nuevo rol del usuario
    const handleSaveRole = (email, userId) => {
        const newRole = selectedRoles[userId];
        if (newRole) {
            actions.modifyUserRole(email, newRole)
                .then(success => {
                    if (success) {
                        alert("Role updated successfully!");
                    } else {
                        alert("Failed to update role.");
                    }
                });
        }
    };

    const handleDeleteUser = (email) => {
        actions.deleteUser(email);
    };

    return (
        <div className="container">
            <div className="left-container">
                <p className="text-center">
                    <img className="left-container-logo" src={Logo} alt="Logo" />
                </p>
            </div>
            <div className="right-container">
                <h1 className="text-center">Manage Users</h1>
                <ul className="list-group">
                    {store.users
                        .filter(user => user.global_role !== "Administrador de Plataforma")
                        .map(user => (
                            <li className="list-group-item d-flex align-items-center justify-content-between" key={user.id}>
                                <div>
                                    <p>{user.full_name}</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <select
                                        value={selectedRoles[user.id] || user.global_role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="" disabled>Select role</option>
                                        {store.roles
                                            .filter(role => role.name !== "Administrador de Plataforma")
                                            .map(role => (
                                                <option key={role.id} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        onClick={() => handleSaveRole(user.email, user.id)}
                                        className="btn btn-primary mx-2"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.email)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};
