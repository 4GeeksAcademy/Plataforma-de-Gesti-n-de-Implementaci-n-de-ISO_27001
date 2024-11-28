import React, { Component } from "react";
import "../../styles/index.css";
import "../../styles/footer.css";

export const Footer = () => {
    const developers = [
        {
            name: "Vinka Adriana Vladislavic Nolasco",
            github: "https://github.com/VinkaVladislavic",
        },
        {
            name: "Juan Pablo Castillo Molina",
            github: "https://github.com/desarrollador2",
        },
        {
            name: "Jose Pedro Rivero Peña",
            github: "https://github.com/PedroRiverop",
        },
    ];

    return (
        <footer className="footer">
			<div className="footer-top">
				<p>Desarrollado con ❤️ por:</p>
				<div className="developer-links">
					{developers.map((dev, index) => (
						<a
							key={index}
							href={dev.github}
							target="_blank"
							rel="noopener noreferrer"
							className="developer-link"
						>
							<i className="fab fa-github"></i> {dev.name}
						</a>
					))}

				</div>
			</div>
            
			<div className="footer-bottom">
				<p>© {new Date().getFullYear()} - Todos los derechos reservados.</p>
				<div className="footer-links">
                    <a href="/terms" className="footer-link">
                        Términos y Condiciones
                    </a>
                    |
                    <a href="/privacy" className="footer-link">
                        Política de Privacidad
                    </a>
                </div>
			</div>
        </footer>
    );
};