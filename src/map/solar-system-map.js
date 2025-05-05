//Other imports
import { throttle } from "lodash";
import { useState, useEffect, useRef } from "react";

//Three imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

//Component imports
import { sceneObjects } from "../components/scene-objects";
import SatelliteInfo from "./satellite-info";

//CSS imports
import "../css/map.css";

const SolarSystemMap = () => {
	//Date.now() returns the number of milliseconds since January 1, 1970
	//86400000 is the number of milliseconds in 1 day
	//[Date.now() - 86400000] = number of days since January 1, 1970
	//2440587 is the Julian Ephemeris Date on January 1, 1970
	//Adding the two values together gets our current Julian Ephemeris Date
	const julian1970Date = 2440587;

	let [currentDate, setCurrentDate] = useState(Date.now() / 86400000);
	let [julianEphemerisDate, setJulianEphemerisDate] = useState(Date.now() / 86400000 + julian1970Date);
	let [distance, setDistance] = useState(null);

	const ref = useRef();

	let camera;
	let renderer;
	let labelRenderer;
	let scene;
	let sphereObjects = [];
	let objectNames = ["Sun", "Mercury", "Venus", "Mars", "Earth", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
	//let handleZoom = handleZoom.bind(this);
	//let dwarfPlanets= [];
	//let moons = [];
	//let comets = [];

	const cameraSetup = () => {
		let aspectRatio = window.innerWidth / window.innerHeight;

		//We need to have small fov values because of the scales we are working with
		// -- otherwise our image will be stretch if resized
		//Also, very small fov allows us to zoom into very small areas
		camera = new THREE.PerspectiveCamera(
			0.25, // fov = field of view
			aspectRatio, // aspect ratio
			0.01, // near plane
			10000000 // far plane
		);

		//Set initial camera positions
		camera.position.z = 1000;
		camera.zoomSpeed = 1;

		//Set distance to related zoom level
		setDistance(camera.zoom);
	};

	const sceneSetup = () => {
		//Initialize
		scene = new THREE.Scene();

		//Set 3D Renderer
		renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
		//renderer.setSize(mount.clientWidth, mount.clientHeight);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement); // mount using React ref

		//Set 2D Renderer for satellite labels
		labelRenderer = new CSS2DRenderer();
		labelRenderer.domElement.className = "twoDRenderer";
		labelRenderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		// OrbitControls allow a camera to orbit around the object -- https://threejs.org/docs/#examples/controls/OrbitControls
		let controls = new OrbitControls(camera, labelRenderer.domElement);

		//Check zoom level to update distance meter, update rotate speed based on zoom
		controls.addEventListener("change", throttle(handleZoom, 350));
		controls.zoomSpeed = 2;
	};

	const addSceneObjects = async () => {
		//Build the planets, the sun, and their corresponding orbits
		objectNames.forEach(async (object) => {
			if (object !== "Sun") {
				let planetOrbitObject = sceneObjects.buildOrbitObject(object, julianEphemerisDate);
				scene.add(planetOrbitObject);
			}
			//We need to await the asynchronous return value that loads in the texture
			let sphereObject = await sceneObjects.buildSphereObject(object);
			sphereObjects.push(sphereObject);
			scene.add(sphereObject);
		});
	};

	const zoomToObject = (sphereObjects) => {
		let satelliteLabel = document.getElementsByClassName("satelliteLabel");

		//We have to listen to DOMContentLoaded otherwise our other code will run before our HTML Collection has loaded
		//-- i.e. it is asynchronous
		document.addEventListener("DOMContentLoaded", () => {
			//Attach event listener to each label and apply appropriate camera positions
			//-- NOTE -- We cannot use forEach in an HTMLCollection
			for (let i = 0; i < satelliteLabel.length; i++) {
				satelliteLabel[i].addEventListener("click", () => {
					//Reset camera position to appropriate object
					camera.position.x = sphereObjects[i].geometry.boundingSphere.center.x;
					camera.position.y = sphereObjects[i].geometry.boundingSphere.center.y;
					camera.position.z = sphereObjects[i].geometry.boundingSphere.center.z + 10;

					//Must be called everytime the camera object is updated
					camera.updateProjectionMatrix();
				});
			}
		});
	};

	const startAnimationLoop = () => {
		renderer.render(scene, camera);
		labelRenderer.render(scene, camera);
		// The window.requestAnimationFrame() method tells the browser that you wish to perform
		// an animation and requests that the browser call a specified function
		// to update an animation before the next repaint
		requestAnimationFrame(startAnimationLoop);
	};

	//If browser window size is changed, we need to change our camera and scene settings to fit accordingly
	const handleWindowResize = () => {
		//Update camera aspect ratio
		camera.aspect = window.innerWidth / window.innerHeight;

		//Must be called everytime the camera object is updated
		camera.updateProjectionMatrix();

		//Update 2D & 3D Renderers
		renderer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.setSize(window.innerWidth, window.innerHeight);
	};

	//Change rotational speed based on what object we are looking at and how close we are to it
	const handleZoom = () => {
		//console.log("handleZoom()");
		//console.log("rotateSpeed: " + controls.rotateSpeed);
		//setState({distance: camera.position.z});
		//controls.rotateSpeed = something;
	};

	/* 	componentWillUnmount() {
		window.removeEventListener("resize", handleWindowResize);
		controls.removeEventListener("change", handleZoom);
		window.cancelAnimationFrame(requestID);
		controls.dispose();
	} */

	useEffect(() => {
		cameraSetup();
		sceneSetup();
		addSceneObjects();
		zoomToObject(objectNames);
		startAnimationLoop();
		window.addEventListener("resize", throttle(handleWindowResize, 350));
		//window.addEventListener("wheel", throttle(handleZoom, 350));
	}, [
		cameraSetup,
		sceneSetup,
		addSceneObjects,
		zoomToObject,
		startAnimationLoop,
		handleWindowResize,
		objectNames,
		setDistance,
	]);

	return (
		<div className="solar-system-map" ref={ref}>
			<SatelliteInfo distance={distance} />
		</div>
	);
};

export default SolarSystemMap;
