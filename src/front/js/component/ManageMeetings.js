import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const ManageMeetings = ({ projectId }) => {
    const { store, actions } = useContext(Context);
    const [meetingDetails, setMeetingDetails] = useState({
        topic: "",
        start_time: "",
        duration: "",
        timezone: "UTC"
    });
    const [meetings, setMeetings] = useState([]); // Estado para las reuniones del proyecto

    useEffect(() => {
        // Cargar reuniones del proyecto al montar el componente
        const loadMeetings = async () => {
            const data = await actions.getProjectMeetings(projectId);
            setMeetings(data || []);
        };
        loadMeetings();
    }, [projectId]);

    const handleChange = (e) => {
        setMeetingDetails({ ...meetingDetails, [e.target.name]: e.target.value });
    };

    const handleCreateMeeting = async () => {
        const success = await actions.createMeeting(projectId, meetingDetails);
        if (success) {
            alert("Reunión creada con éxito");
            const updatedMeetings = await actions.getProjectMeetings(projectId);
            setMeetings(updatedMeetings || []);
        } else {
            alert("Error al crear la reunión");
        }
    };

    return (
        <div className="manage-meetings">
            <h3>Crear Nueva Reunión</h3>
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
