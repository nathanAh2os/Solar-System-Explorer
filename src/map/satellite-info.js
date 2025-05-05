//Measurement AU overlay on solar system map
//https://riptutorial.com/reactjs/example/3846/nesting-components
//Nesting using props -- distanceNav is child of solarSystemMap

//React import
import React, { Component } from "react";

//CSS import
import "../css/satellite-info.css";

const SatelliteInfo = ({ distance }) => {
	return (
		<div className="distance">
			<p>{distance} AU</p>
			<hr></hr>
		</div>
	);
};

export default SatelliteInfo;
