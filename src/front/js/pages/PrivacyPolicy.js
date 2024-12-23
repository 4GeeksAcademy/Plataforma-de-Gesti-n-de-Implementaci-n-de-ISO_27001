import React from 'react';
import '../../styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <h1 className="privacy-title">Política de Privacidad</h1>
            <p className="privacy-intro">
                En CerBro 27001, valoramos su privacidad y estamos comprometidos a proteger su información personal. Esta Política de Privacidad
                describe cómo recopilamos, usamos y protegemos su información.
            </p>

            <h2 className="privacy-section-title">1. Información que Recopilamos</h2>
            <p>
                Podemos recopilar información personal que usted proporcione directamente, como su nombre, correo electrónico y número de teléfono.
                También podemos recopilar información automáticamente, como su dirección IP, tipo de navegador y datos de navegación.
            </p>

            <h2 className="privacy-section-title">2. Uso de su Información</h2>
            <p>
                Utilizamos la información recopilada para proporcionar y mejorar nuestros servicios, responder a sus consultas y enviarle
                comunicaciones relacionadas con nuestros productos y servicios.
            </p>

            <h2 className="privacy-section-title">3. Compartir su Información</h2>
            <p>
                No compartimos su información personal con terceros, excepto cuando sea necesario para cumplir con la ley, proteger nuestros derechos
                o proporcionar los servicios solicitados por usted.
            </p>

            <h2 className="privacy-section-title">4. Protección de su Información</h2>
            <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra el acceso no autorizado,
                pérdida o alteración.
            </p>

            <h2 className="privacy-section-title">5. Sus Derechos</h2>
            <p>
                Usted tiene derecho a acceder, rectificar o eliminar su información personal en cualquier momento. Para ejercer estos derechos,
                puede ponerse en contacto con nosotros a través del correo electrónico proporcionado.
            </p>

            <h2 className="privacy-section-title">6. Cambios a esta Política</h2>
            <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Cualquier cambio será publicado en esta página y tendrá efecto
                inmediato.
            </p>

            <h2 className="privacy-section-title">7. Contacto</h2>
            <p>
                Si tiene preguntas o inquietudes sobre esta Política de Privacidad, puede contactarnos en:
            </p>
            <p><strong>Correo electrónico:</strong> privacy@consultancysecurity.com</p>
        </div>
    );
};

export default PrivacyPolicy;
