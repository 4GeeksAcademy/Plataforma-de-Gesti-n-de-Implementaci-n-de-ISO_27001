import React from "react";
import "../../styles/default.css"; 

const imagenUrl = 'https://sshteam.com/wp-content/uploads/2024/08/Logo-ISO-27001.png';

export const Default = () => {
    return (
        <div className="container">
            <div className="content">
                <img src={imagenUrl} alt="Descripción de la imagen" className="image" />
                <div className="text-content">
                    <p>
                        La norma ISO/IEC 27001 es un estándar internacional de gestión de la seguridad de la información (SGSI) que establece los requisitos para establecer, implementar, mantener y mejorar un sistema de gestión enfocado en la protección de la información confidencial de las organizaciones. La norma se estructura en una serie de cláusulas que guían a las organizaciones en el establecimiento de una cultura de seguridad integral. A continuación, se presenta una reseña de los puntos de la ISO 27001 correspondientes a los apartados 4 a 10, con énfasis en lo que implica la relación con los primeros tres puntos (1, 2 y 3).
                    </p>
                    <p>
                        Antes de abordar los puntos 4 a 10, es fundamental reconocer que la ISO 27001 comienza con la definición del alcance del sistema de gestión de seguridad de la información (SGSI). El punto 1 establece el ámbito general de la norma, mientras que el punto 2 y 3 se centran en la normativa que establece la aplicación de los controles, así como las exclusiones que pueden ser pertinentes para la organización. A partir de estos primeros pasos, la organización debe decidir el contexto específico y los límites de su sistema de gestión, lo cual guiará todo el proceso posterior.
                    </p>
                </div>
            </div>
        </div>
    );
};
