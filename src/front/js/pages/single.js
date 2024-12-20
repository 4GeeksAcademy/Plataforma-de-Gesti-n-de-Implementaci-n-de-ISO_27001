import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Single = props => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	
	const createMeeting = async () => {
		const response = await fetch("http://tu-backend.com/create-meeting", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				topic: "Reunión del Equipo",
				start_time: "2024-12-20T10:00:00Z", // Formato ISO 8601
				duration: 60,
				agenda: "Discusión sobre avances del proyecto",
			}),
		});
	
		const data = await response.json();
		if (response.ok) {
			alert(`Reunión creada: ${data.join_url}`);
		} else {
			console.error(data.error);
		}
	};
	
	return <button onClick={createMeeting}>Crear Reunión en Zoom</button>;
	
};

Single.propTypes = {
	match: PropTypes.object
};
