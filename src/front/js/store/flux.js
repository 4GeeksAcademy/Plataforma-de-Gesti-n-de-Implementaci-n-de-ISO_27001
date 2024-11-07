const backendURL=process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
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
			registerInitialAdmin: async (full_name, email, password, project_name) => {
				const response = await fetch(backendURL + "/register/initial-admin", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					},
					body: JSON.stringify({ full_name, email, password, project_name })
				});
				if(!response.ok) {
					console.log("Error: " + response.status)
					return false
				}
				return true
			}

		}
	};
};

export default getState;
