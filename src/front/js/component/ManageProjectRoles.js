import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

export const ManageProjectRoles = ({ projectId }) => {
    const { store, actions } = useContext(Context);
    const [projectUsers, setProjectUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        actions.getAllUsers();
        actions.getAllRoles();
    }, []);

    useEffect(() => {
        const fetchProjectUsers = async () => {
            const roles = await actions.getProjectRoles(projectId);
            if (roles) {
                setProjectUsers(roles);
            } else {
                console.error("Error fetching project roles.");
            }
        };
        fetchProjectUsers();
    }, [projectId]);

    const handleAddUser = async () => {
        // Buscar el usuario en la lista de usuarios
        const user = store.users.find((u) => u.email === email);
    
        if (!user) {
            setErrorMessage("Usuario no encontrado. Asegúrate de que el email sea correcto.");
            return;
        }
    
        const roleId = store.roles.find((r) => r.name === role)?.id;
    
        if (!roleId) {
            setErrorMessage("Rol no válido. Selecciona un rol válido.");
            return;
        }
    
        const addedUser = await actions.addUserToProject(projectId, user.id, roleId);
    
        if (addedUser) {
            setEmail("");
            setRole("");
            setProjectUsers([...projectUsers, {
                user: addedUser.user,
                role: addedUser.role || { name: "Sin rol asignado" }, // Fallback
            },]); // Agrega el usuario retornado a la lista
        } else {
            setErrorMessage("Error al agregar usuario.");
        }
    };
    
    

    const handleDeleteUser = async (userId) => {
        const success = await actions.removeUserFromProject(projectId, userId);
        if (success) {
            setProjectUsers(projectUsers.filter(user => user.user.id !== userId));
        } else {
            setErrorMessage("Error al eliminar usuario.");
        }
    };

    const handleUpdateRole = async (userId, newRoleName) => {
        const success = await actions.updateUserRoleInProject(projectId, userId, newRoleName);
        if (success) {
            setProjectUsers((prevUsers) =>
                prevUsers.map((userRole) =>
                    userRole.user.id === userId
                        ? { ...userRole, role: { ...userRole.role, name: newRoleName } }
                        : userRole
                )
            );
        } else {
            setErrorMessage("Error al actualizar el rol del usuario.");
        }
    };

    return (
        <div>
            <h3>Gestión de Usuarios y Roles</h3>
            <div>
                {projectUsers.map(({ user, role }) => (
                    <div key={user.id}>
                        <p>
                            {user.full_name} ({user.email}) - {role?.name || "Sin rol asignado"}
                        </p>
                        <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                        <select value={role?.name || ""} onChange={(e) => handleUpdateRole(user.id, e.target.value)}>
                            <option value="Consultor">Consultor</option>
                            <option value="Visitante">Visitante</option>
                            <option value="Jefe de Proyecto">Jefe de Proyecto</option>
                        </select>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo del usuario"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Seleccione un rol</option>
                    <option value="Consultor">Consultor</option>
                    <option value="Visitante">Visitante</option>
                </select>
                <button onClick={handleAddUser}>Agregar Usuario</button>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};
