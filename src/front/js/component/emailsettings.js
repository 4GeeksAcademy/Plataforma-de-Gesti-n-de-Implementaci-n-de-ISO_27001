import React, { useState } from 'react';

const EmailSettings = () => {
    const [settings, setSettings] = useState({
        MAIL_SERVER: '',
        MAIL_PORT: '',
        MAIL_USERNAME: '',
        MAIL_PASSWORD: '',
        MAIL_USE_TLS: false,
        MAIL_USE_SSL: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/settings/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            const result = await response.json();
            alert(result.msg);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar la configuración');
        }
    };

    return (
        <div>
            <h1>Configuración de Relay de Email</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Servidor SMTP:</label>
                    <input
                        type="text"
                        name="MAIL_SERVER"
                        value={settings.MAIL_SERVER}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Puerto:</label>
                    <input
                        type="number"
                        name="MAIL_PORT"
                        value={settings.MAIL_PORT}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        name="MAIL_USERNAME"
                        value={settings.MAIL_USERNAME}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="MAIL_PASSWORD"
                        value={settings.MAIL_PASSWORD}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Usar TLS:</label>
                    <input
                        type="checkbox"
                        name="MAIL_USE_TLS"
                        checked={settings.MAIL_USE_TLS}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Usar SSL:</label>
                    <input
                        type="checkbox"
                        name="MAIL_USE_SSL"
                        checked={settings.MAIL_USE_SSL}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Guardar Configuración</button>
            </form>
        </div>
    );
};

export default EmailSettings;
