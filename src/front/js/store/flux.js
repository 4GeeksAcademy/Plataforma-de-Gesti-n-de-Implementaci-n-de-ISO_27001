const backendURL=process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			roles: [],
			message: null,
			ISOS: null,
			projects: [], // Definir projects como un arreglo vacío
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			accessToken: null
		},
		actions: {
			registerAccount: async (full_name, email, password) => {
				const response = await fetch(backendURL + "/register", {
					method: "POST",
				
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					},
					body: JSON.stringify({ full_name, email, password})
				});
				if(!response.ok) {
					console.log("Error: " + response.status)
					return false
				}

				 // Intentar hacer login automático después del registro
				const loginSuccess = await getActions().loginAccount(email, password);
				return loginSuccess;
			},
			
			loginAccount: async (email, password) => {
				try{
				const response = await fetch(backendURL + "/login", {
					method: "POST",
					
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({email, password})
				});
				if(!response.ok) {
					console.log("Error: " + response.status)
					return false
				}
				const data = await response.json();
				setStore({ accessToken: data.token,  user: { full_name: data.full_name }});
				localStorage.setItem("accessToken", data.token); //Para guardar en el localStrorage
        		return true;

				} catch (error) {console.error("Error en la solicitud de login:", error);
					return false;}
			},
			getAllUsers: async () => {
				const response = await fetch(backendURL + "/manage/users", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					},
				});
				if(!response.ok) {
					console.log("Error: " + response.status)
					return false;
				}
				const data = await response.json();
				setStore({ users: data });
				return true;
			},
			getAllRoles: async () => {
				const response = await fetch(backendURL + "/all/roles", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					},
				});
				if(!response.ok) {
					console.log("Error: " + response.status)
					return false;
				}
				const data = await response.json();
				setStore({ roles: data });
				return true;
			},
			deleteUser: async (email) => { 
				const response = await fetch(backendURL + "/user", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: email }), 
				});
			
				if (!response.ok) {
					console.log("Error: " + response.status);
					return false;
				}
				
				const data = await response.json();
			
				if (data.msg === "Usuario eliminado") {
					
					setStore({
						users: store.users.filter(user => user.email !== email),
					});
				}
				return true;
			},
			modifyUserRole: async (email, newRole) => {
				const response = await fetch(backendURL + "/change/user/role", {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: email,
						global_role: newRole,
					}),
				});
			
				if (!response.ok) {
					console.log("Error: " + response.status);
					return false;
				}
			
				await getActions().getAllUsers();

			},
			getUserProjects: async () => {
				const response = await fetch(`${backendURL}/projects`, {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${getStore().accessToken}`,
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					console.log("Error: " + response.status);
					return false;
				}
				const data = await response.json();
				setStore({ projects: data });
				return true;
			},
			deleteProject: async (projectId) => {
				const response = await fetch(`${backendURL}/projects/${projectId}`, {
					method: "DELETE",
					headers: {
						"Authorization": `Bearer ${getStore().accessToken}`,
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					console.log("Error: " + response.status);
					return false;
				}
				return true;
			},
			deleteAllProjects: async () => {
				const { projects } = getStore();
				for (let project of projects) {
					await fetch(`${backendURL}/projects/${project.id}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${getStore().accessToken}`,
							"Content-Type": "application/json",
						},
					});
				}
				return true;
			},
			createProject: async (projectName, companyName, projectDescription, startDate) => {
				const store = getStore();
				
				try {
					const response = await fetch(`${backendURL}/project`, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${store.accessToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ projectName, companyName, projectDescription, startDate, })
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						console.log("Error:", errorData);
						return false;
					}
			
					const data = await response.json();
					// Actualizar la lista de proyectos en el store (opcional)
					await getActions().getUserProjects();
					return true;
			
				} catch (error) {
					console.error("Error al crear el proyecto:", error);
					return false;
				}
			}, 
			getIsos: async () =>{
				const response = await fetch(backendURL + "/testing")
				if (response.ok){
					const data = await response.json()
					setStore({ISOS: data})
				}
			}, 
			getParents: () => {
				const store = getStore()
				let parents = store.ISOS.filter((iso) => iso.father == "0")
				return parents
			},
			getChildren: (fatherID) => {
				const store = getStore()
				const info = store.ISOS
				let subdomains  = info.filter((dominio) => dominio.father == fatherID)
				return subdomains
			},
			getSubDomainInfo: (subDomainID) =>{
				let {ISOS} = getStore()
				let subDomain = ISOS.find((iso) => iso.id == parseInt(subDomainID))
				let domain = ISOS.find((iso) => iso.id == parseInt(subDomain.father))
				let requirements =getActions().getChildren(subDomainID)

				return {
					dominio: domain.title,
					subDominio: subDomain.title,
					requerimientos: requirements 
				}
			},
			forgotPassword: async (email) => {
                try {
                    const response = await fetch(backendURL +"/forgotpassword", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: email }), 
                    });

                    if (!response.ok) {
                        console.log("Error: " + response.status);
                        const errorData = await response.json();
                        setStore({
                            message: null,
                            error: errorData.msg || "Error desconocido",
                        });
                        return false;
                    }

                    const data = await response.json();
                    if (data.msg) {
                        setStore({
                            message: data.msg,
                            error: null,
                        });
                        return true;
                    }
                } catch (err) {
                    console.error("Error en forgotPassword:", err);
                    setStore({
                        message: null,
                        error: "Ocurrió un error al procesar la solicitud.",
                    });
                }
                return false;
            },
			changePassword: async (currentPassword, newPassword, confirmPassword, token) => {
				// Verifica que las contraseñas nuevas coincidan
				if (newPassword !== confirmPassword) {
					setStore({
						message: null,
						error: "Las contraseñas nuevas no coinciden.",
					});
					return false;
				}
				// Verifica que la nueva contraseña tenga al menos 6 caracteres
				if (newPassword.length < 6) {
					setStore({
						message: null,
						error: "La nueva contraseña debe tener al menos 6 caracteres.",
					});
					return false;
				}
				try {
					const response = await fetch(backendURL + "/changepassword", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`, // Se envía el token en el encabezado
						},
						body: JSON.stringify({
							current_password: currentPassword,
							new_password: newPassword,
						}),
					});
			
					if (!response.ok) {
						console.log("Error: " + response.status);
						const errorData = await response.json();
						setStore({
							message: null,
							error: errorData.msg || "Error desconocido",
						});
						return false;
					}
			
					const data = await response.json();
					if (data.msg) {
						setStore({
							message: data.msg,
							error: null,
						});
						return true;
					}
				} catch (err) {
					console.error("Error en changePassword:", err);
					setStore({
						message: null,
						error: "Ocurrió un error al procesar la solicitud.",
					});
				}
				return false;
			}
			
			
		}
	};
};

export default getState;
