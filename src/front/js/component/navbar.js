import React from "react";
import "../../styles/index.css";
import WhiteLogo from "../../img/white-logo.png";
import ConsultancySecurityText from "../../img/white-text.png";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="container-fluid d-flex align-items-center">
				<a className="navbar-brand d-flex align-items-center" href="#">
					<img src={WhiteLogo} alt="Consultancy Security Logo" width="40" className="d-inline-block align-text-top ms-4"/>
					<img src={ConsultancySecurityText} alt="Consultancy Security" width="120" className="d-inline-block align-text-top ms-2"/>
				</a>
				<div className="d-flex align-items-end">
					<button type="button" className="btn">Register</button>
					<button type="button" className="btn ms-2">Login</button>
				</div>
			</div>
		</nav>
	);
};
