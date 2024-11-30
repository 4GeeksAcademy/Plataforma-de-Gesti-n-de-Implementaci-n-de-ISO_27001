const backendURL=process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			roles: [],
			message: null,
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
			
		}
	};
};

export default getState;
