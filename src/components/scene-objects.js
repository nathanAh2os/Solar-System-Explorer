//Data for every solar object we want to build in our map
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { planetPositions } from "./calc-planet-pos";

//const DOMAIN_URL = "https://react-map-project-95e99.web.app/";
const DOMAIN_URL = "http://localhost:3000/";

export const sceneObjects = {
	planets: new Map([
		[
			"Sun",
			{
				sphereGeometry: new THREE.SphereGeometry(0.009304945274, 32, 32),
				//url: "http://192.168.7.37:8000/src/solartextures/2k_sun.jpg",
				url: `${DOMAIN_URL}2k_sun.jpg`,
			},
		],
		[
			"Mercury",
			{
				yearLength: 87.97,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#722018" }),
				sphereGeometry: new THREE.SphereGeometry(0.0000326141, 32, 32),
				planetIndex: 0,
				url: `${DOMAIN_URL}2k_mercury.jpg`,
			},
		],
		[
			"Venus",
			{
				yearLength: 224.7,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#d23a2d" }),
				sphereGeometry: new THREE.SphereGeometry(8.0910243e-5, 32, 32),
				planetIndex: 1,
				url: `${DOMAIN_URL}2k_venus_surface.jpg`,
			},
		],
		[
			"Mars",
			{
				yearLength: 688,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#d2932d" }),
				sphereGeometry: new THREE.SphereGeometry(4.53148e-5, 32, 32),
				planetIndex: 2,
				url: `${DOMAIN_URL}2k_mars.jpg`,
			},
		],
		[
			"Earth",
			{
				yearLength: 366,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#2d35d2" }),
				sphereGeometry: new THREE.SphereGeometry(8.5175009e-5, 32, 32),
				planetIndex: 3,
				url: `${DOMAIN_URL}2k_earth_daymap.jpg`,
			},
		],
		[
			"Jupiter",
			{
				yearLength: 4334,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#0D86FF" }),
				sphereGeometry: new THREE.SphereGeometry(0.0009346523406, 32, 32),
				planetIndex: 4,
				url: `${DOMAIN_URL}2k_jupiter.jpg`,
			},
		],
		[
			"Saturn",
			{
				yearLength: 10757,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#66EA05" }),
				sphereGeometry: new THREE.SphereGeometry(0.0007785137546, 32, 32),
				planetIndex: 5,
				url: `${DOMAIN_URL}2k_saturn.jpg`,
			},
		],
		[
			"Uranus",
			{
				yearLength: 30689,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#0D86FF" }),
				sphereGeometry: new THREE.SphereGeometry(0.000339068997, 32, 32),
				planetIndex: 6,
				url: `${DOMAIN_URL}2k_uranus.jpg`,
			},
		],
		[
			"Neptune",
			{
				yearLength: 60193,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#07ED54" }),
				sphereGeometry: new THREE.SphereGeometry(0.000329175808, 32, 32),
				planetIndex: 7,
				url: `${DOMAIN_URL}2k_neptune.jpg`,
			},
		],
		[
			"Pluto",
			{
				yearLength: 90556,
				planetCenter: null,
				orbitMaterial: new THREE.LineBasicMaterial({ color: "#E2FF0D" }),
				sphereGeometry: new THREE.SphereGeometry(1.58826e-5, 32, 32),
				planetIndex: 8,
				url: `${DOMAIN_URL}2k_neptune.jpg`,
			},
		],
	]),

	loader: new THREE.TextureLoader(),

	buildOrbitObject(name, julianEphemerisDate) {
		//Retrieve value associated with our planet name key, LOOKUP
		let planet = this.planets.get(name);
		let orbitPath = [];

		//Call calculation functions to determine planet orbit position on each day
		for (let i = 0; i < planet.yearLength; i++) {
			planetPositions.trueKeplerianValues(planet.planetIndex, julianEphemerisDate);
			planetPositions.calculateMeanAnomaly();
			planetPositions.calculateEccentricAnomaly();
			let currentCoordinate = planetPositions.calculatePlanetCoordinates();
			orbitPath.push(new THREE.Vector3(currentCoordinate[0], currentCoordinate[1], currentCoordinate[2]));

			//For our first calculated/current day, we want this to be where we generate our actual planet position
			if (i === 0) {
				planet.planetCenter = currentCoordinate;
			}
			//If this our last calculated day, we want to take a fraction value
			else if (i == planet.yearLength - 1) {
			}
			julianEphemerisDate++;
		}

		//Add our orbit array data & color to a THREE line object and return
		let orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPath);

		let orbitSceneObject = new THREE.Line(orbitGeometry, planet.orbitMaterial);
		return orbitSceneObject;
	},

	async buildSphereObject(name) {
		//Retrieve value associated with our planet name key, LOOKUP
		let planet = this.planets.get(name);

		//Set coordinates of our sphere object, based on previous orbit calcuations
		if (name !== "Sun") {
			planet.sphereGeometry.translate(planet.planetCenter[0], planet.planetCenter[1], planet.planetCenter[2]);
		} else {
			planet.sphereGeometry.translate(0, 0, 0);
		}
		//Due to browser security settings, you cannot load textures externally to our local webpage,
		//Therefore, we need to set up seperate local server, use command: http-server . -p 8000 --cors
		//Specifying the --cors tag sets it to true, which fixes "no access Control-Allow-Origin" issues
		//https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally
		//url of textures will be based on http://localhost:8000/directories
		//http://192.168.7.37:8000/src/solartextures//2k_sun.jpg

		let loader = new THREE.TextureLoader();
		loader.crossOrigin = "";

		//Set texture of our sphere object
		//We need a promise because loading the texture is an asynchronous operation
		//load(url: string, onLoad: callback function)
		let loadingPromise = new Promise((resolve, reject) => {
			let finalSphereObject = null;
			loader.load(planet.url, (sphereTexture) => {
				let sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
				finalSphereObject = new THREE.Mesh(planet.sphereGeometry, sphereMaterial);

				//Utility function -- build label
				let satelliteLabel = this.buildLabelObject(planet, name);
				finalSphereObject.add(satelliteLabel);

				if (finalSphereObject != null) {
					resolve(finalSphereObject);
				} else {
					reject("Unable to load object texture");
				}
			});
		});

		//Apparently you have to add "return" keyword before the promise.then() statement,
		//otherwise it won't properly return our value, we can still have our return statement
		//within our then()
		return loadingPromise.then((finalSphereObject) => {
			return finalSphereObject;
		});
	},

	buildLabelObject(planet, name) {
		//Create HTML element "div" for our satellite label
		const labelDiv = document.createElement("div");
		labelDiv.className = "satelliteLabel";
		labelDiv.style.marginTop = "-1em";
		labelDiv.textContent = name;

		//Apply our new div to a CSS2DObject and center on the appropriate satellite
		let satelliteLabel = new CSS2DObject(labelDiv);
		if (name !== "Sun") {
			satelliteLabel.position.set(planet.planetCenter[0], planet.planetCenter[1], planet.planetCenter[2]);
		} else {
			satelliteLabel.position.set(0, 0, 0);
		}
		return satelliteLabel;
	},

	//Each planet's year's length in Earth days + 1
	/*      this.mercuryYear = 89; 87.97
            this.venusYear = 226; 224.70
            this.marsYear = 688; 686.99
            this.earthYear = 366; 365.26
            this.jupiterYear = 4334; 4332.94
            this.saturnYear = 10757; 10,755.99
            this.uranusYear = 30689; 30,687.99
            this.neptuneYear = 60193; 60191.68
            this.plutoYear = 90556; 90,555.50 */

	//Planet Diameters
	//Sun -- 1,392,000 km -- 0.009304945274
	//Mercury -- 4879 km -- 3.26141e-5
	//Venus -- 12,104 km -- 8.0910243e-5
	//Earth -- 12,742 km -- 8.5175009e-5
	//Mars -- 6779 km -- 4.53148e-5
	//Jupiter -- 139,822 km -- 0.0009346523406
	//Saturn -- 116,464 km -- 0.0007785137546
	//Uranus -- 50,724 km -- 0.000339068997
	//Neptune -- 49,244 km -- 0.000329175808
	//Pluto -- 2376 km -- 1.58826e-5
};
