import React,  { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";
import WhiteLogo from "../../img/white-logo.png";
import ConsultancySecurityText from "../../img/white-text.png";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleRegisterAccount = () => {
        navigate("/register");
    };
	const handleLogin = () => {
        navigate("/login");
    };
	
	const handleProjects = () => {
        navigate("/projectlist"); 
    };
	const handleProfile = () => {
		navigate("/profile"); 
	};
	
	const handleHelp = () => {
		navigate("/help"); 
	};
	const handleLogout = () => {
        localStorage.removeItem("accessToken"); // Limpia el token
        actions.logout(); // Limpia el estado
        navigate("/");
    };
	const handleLogoClick = () => {
        navigate("/");
    };


	useEffect(() => {
        // Verifica si hay un token y obtiene el usuario actual
        if (store.accessToken) {
            actions.getCurrentUser();
        }
    }, []);
	return (
		<nav className="navbar navbar-expand-lg navbar-light">
			<div className="container-fluid d-flex align-items-center">
				<a className="navbar-brand d-flex align-items-center" href="#">
					<img src={WhiteLogo} alt="Consultancy Security Logo" width="40" className="d-inline-block align-text-top ms-4" onClick={handleLogoClick}/>
					<img src={ConsultancySecurityText} alt="Consultancy Security" width="120" className="d-inline-block align-text-top ms-2" onClick={handleLogoClick}/>
				</a>
				<div className="d-flex align-items-end">
				{store.accessToken && store.user ? (
                        // Si el usuario está logueado
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {store.user.full_name}
                            </button>
                            <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <li>
									<button className="dropdown-item" onClick={handleProfile}>
        								Ver Mi Perfil
    								</button>
                                </li>
                                <li>
									<button className="dropdown-item" onClick={handleProjects} >
                                        Mi Lista de Proyectos
                                    </button>
                                </li>
                                <li>
									<button className="dropdown-item" onClick={handleHelp}>
        								Ayuda
    								</button>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        // Si el usuario no está logueado
                        <>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleRegisterAccount}
                            >
                                Register
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </>
                    )}
				</div>
			</div>
		</nav>
	);
};
