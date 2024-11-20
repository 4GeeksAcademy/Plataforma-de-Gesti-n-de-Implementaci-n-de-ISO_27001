import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import heroImage from "../../img/home1.webp";
import whyUs from "../../img/whyUs.jpg";
import cumplimiento from "../../img/Cumplimiento.jpg";
import diseño from "../../img/Diseño.webp";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="home-container" style={{ backgroundImage: `url(${heroImage})` }}>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Gestiona la Seguridad de la Información con <span className="highlight">Confianza</span>
                    </h1>
                    <p className="hero-subtitle">
                        Simplifica la implementación de proyectos y asegura el cumplimiento con estándares modernos.
                    </p>
                    <div className="hero-buttons">
                        <button className="button">Iniciar Sesión</button>
                        <button className="button button-secondary">Registrar</button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="features">
                <h2 className="section-title">¿Por qué elegirnos?</h2>
                <div className="feature-cards">
                    <div className="card">
                        <img src={whyUs} alt="Gestión de Proyectos" className="card-image" />
                        <h3>Gestión de Proyectos</h3>
                        <p>Controla todos tus proyectos en un solo lugar.</p>
                    </div>
                    <div className="card">
                        <img src={cumplimiento} alt="Cumplimiento" className="card-image" />
                        <h3>Cumplimiento</h3>
                        <p>Garantiza la conformidad con ISO 27001.</p>
                    </div>
                    <div className="card">
                        <img src={diseño} alt="Diseño Intuitivo" className="card-image" />
                        <h3>Diseño Intuitivo</h3>
                        <p>Una interfaz que entiende tus necesidades.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta">
                <h2 className="cta-title">¡Empieza hoy mismo!</h2>
                <p className="cta-text">Regístrate y lleva tus proyectos al siguiente nivel.</p>
                <button className="cta-button">Regístrate</button>
            </section>
        </div>
	);
};
