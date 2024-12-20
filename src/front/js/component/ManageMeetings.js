import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const ManageMeetings = ({ projectId }) => {
    const { actions } = useContext(Context);
    const [meetingDetails, setMeetingDetails] = useState({
        access_token: "",
        topic: "",
        start_time: "",
        duration: "",
        timezone: "UTC"
    });
    const [accessToken, setAccessToken] = useState(null);
    const [zoomAccessToken, setZoomAccessToken] = useState(null); 
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchZoomToken = async () => {
            
            const token = await actions.getZoomAccessToken();
            if (token) {
                setZoomAccessToken(token);
                localStorage.setItem("zoomAccessToken", token); // Guarda el token en LocalStorage
            } else {
                console.error("Error al obtener el Zoom access token");
            }
        };
    
        fetchZoomToken();
        handleCallback(); // Verifica si ya hay un token almacenado

    }, []);
    
    useEffect(() => {
        if (zoomAccessToken) {
            setMeetingDetails((prevDetails) => ({
                ...prevDetails,
                access_token: zoomAccessToken,
            }));
        }
    }, [zoomAccessToken]);
    


    useEffect(() => {
        const loadMeetings = async () => {
            const data = await actions.getProjectMeetings(projectId);
            setMeetings(data || []);
        };
        loadMeetings();
    }, [projectId]);

    const handleChange = (e) => {
        setMeetingDetails({ ...meetingDetails, [e.target.name]: e.target.value });
    };

    const handleZoomAuth = async () => {
        const authURL = await actions.createZoomAuthURL();
        if (authURL) {
            window.open(authURL, "_blank"); // Abre la URL de autorización en una nueva pestaña
        } else {
            alert("Error al obtener la URL de autorización");
        }
    };

    const handleCallback = async () => {
        // Revisa si hay un token en localStorage (esto lo configuraremos después de la redirección)
        const savedToken = localStorage.getItem("zoomAccessToken");
        if (savedToken) {
            setAccessToken(savedToken);
            alert("Autorización completada. Puedes crear reuniones.");
        }
    };


    const handleCreateMeeting = async () => {
        if (!accessToken) {
            alert("Sin autorización. Por favor, comunícate con el administrador.");
            return;
        }
        const zoomMeeting = await actions.createZoomMeeting(accessToken, meetingDetails);
        if (zoomMeeting) {
            const saved = await actions.saveMeetingToProject(projectId, {
                ...zoomMeeting,
                topic: meetingDetails.topic,
                start_time: meetingDetails.start_time,
                duration: meetingDetails.duration
            });
            if (saved) {
                alert("Reunión creada y guardada exitosamente.");
                const updatedMeetings = await actions.getProjectMeetings(projectId);
                setMeetings(updatedMeetings || []);
            } else {
                alert("Error al guardar la reunión en el proyecto.");
            }
        } else {
            alert("Error al crear la reunión en Zoom.");
        }
    };

    return (
        <div className="manage-meetings">
            <h3>Crear Nueva Reunión</h3>
            <button onClick={handleZoomAuth}>Autorizar Zoom</button>
            <input
                type="text"
                name="topic"
                placeholder="Tema de la reunión"
                value={meetingDetails.topic}
                onChange={handleChange}
            />
            <input
                type="datetime-local"
                name="start_time"
                value={meetingDetails.start_time}
                onChange={handleChange}
            />
            <input
                type="number"
                name="duration"
                placeholder="Duración (en minutos)"
                value={meetingDetails.duration}
                onChange={handleChange}
            />
            <button onClick={handleCreateMeeting}>Crear Reunión</button>

            <h3>Próximas Reuniones</h3>
            <ul>
                {meetings.slice(0, 2).map((meeting, index) => (
                    <li key={index}>
                        <p><strong>Tema:</strong> {meeting.topic}</p>
                        <p><strong>Inicio:</strong> {new Date(meeting.start_time).toLocaleString()}</p>
                        <p><strong>Enlace:</strong> <a href={meeting.join_url} target="_blank" rel="noopener noreferrer">Unirse</a></p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
