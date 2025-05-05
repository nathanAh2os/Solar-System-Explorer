/* Useful Links ....
    https://ssd.jpl.nasa.gov/?planet_pos
    https://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf
    https://ssd.jpl.nasa.gov/tc.cgi
*/

//https://www.newline.co/fullstack-react/articles/react-create-class-vs-es6-class-components/
export const planetPositions = {
    semiMajorAxis: null,
    eccentricity: null,
    inclination: null,
    meanLongitude: null,
    longitudePerihelion: null,
    longitudeAscendNode: null,
    meanAnomaly: null,
    eccentricAnomaly: null,
    trueAnomaly: null,
    //Just set to this value for now, we can create a timer later to track real-time values based from Date.now()
    //julianEphemerisDate: 2459025.50000, //Roughly 06/22/2020 at 3pm PST
    //Keplerian table values are assumed off of date span ranging from 1800AD - 2050AD
    //[0] is base value, [1] is base value / century value
    //mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto
    keplerianValues: [
        { //Mercury Values
            semiMajorAxis: [0.38709927, 0.00000037], eccentricity: [0.20563593, 0.00001906], inclination: [7.00497902, -0.00594749],
            meanLongitude: [252.25032350, 149472.67411175], longitudePerihelion: [77.45779628, 0.16047689], longitudeAscendNode: [48.33076593, -0.12534081]
        },
        { //Venus Values
            semiMajorAxis: [0.72333566, 0.00000390], eccentricity: [0.00677672, -0.00004107], inclination: [3.39467605, -0.00078890],
            meanLongitude: [181.97909950, 58517.81538729], longitudePerihelion: [131.60246718, 0.00268329], longitudeAscendNode: [76.67984255, -0.27769418]
        },
        { //Mars Values
            semiMajorAxis: [1.52371034, 0.00001847], eccentricity: [0.09339410, 0.00007882], inclination: [1.84969142, -0.00813131],
            meanLongitude: [-4.55343205, 19140.30268499], longitudePerihelion: [-23.94362959, 0.44441088], longitudeAscendNode: [49.55953891, -0.29257343]
        },
        { //Earth Values
            semiMajorAxis: [1.00000261, 0.00000562], eccentricity: [0.01671123, -0.00004392], inclination: [-0.00001531, -0.01294668],
            meanLongitude: [100.46457166, 35999.37244981], longitudePerihelion: [102.93768193, 0.32327364], longitudeAscendNode: [0, 0]
        },
        { //Jupiter Values
            semiMajorAxis: [5.20288700, -0.00011607], eccentricity: [0.04838624, -0.00013253], inclination: [1.30439695, -0.00183714],
            meanLongitude: [34.39664051, 3034.74612775], longitudePerihelion: [14.72847983, 0.21252668], longitudeAscendNode: [100.47390909, 0.20469106]
        },
        { //Saturn Values
            semiMajorAxis: [9.53667594, -0.00125060], eccentricity: [0.05386179, -0.00050991], inclination: [2.48599187, 0.00193609],
            meanLongitude: [49.95424423, 1222.49362201], longitudePerihelion: [92.59887831, -0.41897216], longitudeAscendNode: [113.66242448, -0.28867794]
        },
        { //Uranus Values
            semiMajorAxis: [19.18916464, -0.00196176], eccentricity: [0.04725744, -0.00004397], inclination: [0.77263783, -0.00242939],
            meanLongitude: [313.23810451, 428.48202785], longitudePerihelion: [170.95427630, 0.40805281], longitudeAscendNode: [74.01692503, 0.04240589]
        },
        { //Neptune Vaues
            semiMajorAxis: [30.06992276, 0.00026291], eccentricity: [0.00859048, 0.00005105], inclination: [1.77004347, 0.00035372],
            meanLongitude: [-55.12002969, 218.45945325], longitudePerihelion: [44.96476227, -0.32241464], longitudeAscendNode: [131.78422574, -0.00508664]
        },
        { //Pluto Values
            semiMajorAxis: [39.48211675, -0.00031596], eccentricity: [0.24882730, 0.00005170], inclination: [17.14001206, 0.00004818],
            meanLongitude: [238.92903833, 145.20780515], longitudePerihelion: [224.06891629, -0.04062942], longitudeAscendNode: [110.30393684, -0.01183482]
        }
    ],
    trueKeplerianValues(planetIndex, julianEphemerisDate) {
        //Compute the true value of each of the planet's six Keplerian elements based on the Julian Date
        // 2451545 is the Julian Ephemeris Date of the reference epoch
        let numberOfCenturiesPast = ((julianEphemerisDate - 2451545) / 36525);
        this.semiMajorAxis = this.keplerianValues[planetIndex].semiMajorAxis[0] + (this.keplerianValues[planetIndex].semiMajorAxis[1] * numberOfCenturiesPast);
        this.eccentricity = this.keplerianValues[planetIndex].eccentricity[0] + (this.keplerianValues[planetIndex].eccentricity[1] * numberOfCenturiesPast);
        this.inclination = this.keplerianValues[planetIndex].inclination[0] + (this.keplerianValues[planetIndex].inclination[1] * numberOfCenturiesPast);
        this.meanLongitude = this.keplerianValues[planetIndex].meanLongitude[0] + (this.keplerianValues[planetIndex].meanLongitude[1] * numberOfCenturiesPast);
        this.longitudePerihelion = this.keplerianValues[planetIndex].longitudePerihelion[0] + (this.keplerianValues[planetIndex].longitudePerihelion[1] * numberOfCenturiesPast);
        this.longitudeAscendNode = this.keplerianValues[planetIndex].longitudeAscendNode[0] + (this.keplerianValues[planetIndex].longitudeAscendNode[1] * numberOfCenturiesPast);
    },
    calculateMeanAnomaly() {
        //2) Compute argument of perihelion, and mean anomaly, M
        //We obtain the modulas of the mean anomaly between -360 <= M <= 360
        //let perihelion = this.longitudePerihelion - this.longitudeAscendNode;
        this.meanAnomaly = this.meanLongitude - this.longitudePerihelion;
        this.meanAnomaly = this.meanAnomaly * Math.PI / 180;
    },
    calculateEccentricAnomaly() {
        //To calculate the eccentric anomaly, we use Kepler's equation: 
        //meanAnomaly = eccentricAnomaly - (eccentricity)sin(eccentricAnomaly) --> M = E = eSin(E)
        //However, Kepler's equation cannot be solved algebraically and requires Newton iterations
        //We will iterate within 0.001 values or 100 times over
        let E = null;
        let F = null;
        let dp = 5; //Decimal places
        let delta = Math.pow(10, -dp);
        let i = 0;
        let maxIter = 30;
        if (this.eccentricity < 0.8) {
            E = this.meanAnomaly;
        }
        else {
            E = Math.PI;
        }
        F = E - this.eccentricity * Math.sin(this.meanAnomaly) - this.meanAnomaly;
        while ((Math.abs(F) > delta) && (i < maxIter)) {

            E = E - F / (1.0 - this.eccentricity * Math.cos(E));
            F = E - (this.eccentricity * Math.sin(E)) - this.meanAnomaly;
            i = i + 1;
        }

        E = E / (Math.PI / 180);
        //this.eccentricAnomaly = Math.round(E * Math.pow(10, dp)) / Math.pow(10, dp);
        this.eccentricAnomaly = E;
        this.eccentricityAnomaly = Math.round(this.eccentricity * Math.pow(10, dp)) / Math.pow(10, dp);
    },
    calculatePlanetCoordinates() {
        //http://www.stjarnhimlen.se/comp/ppcomp.html#19

        //Convert from degrees to radians
        this.eccentricAnomaly = this.eccentricAnomaly * Math.PI / 180;
        this.longitudeAscendNode = this.longitudeAscendNode * Math.PI / 180;
        this.longitudePerihelion = this.longitudeAscendNode * Math.PI / 180;
        this.inclination = this.inclination * Math.PI / 180;

        //4) Compute planet's heliocentric coordinates
        let distanceX = this.semiMajorAxis * (Math.cos(this.eccentricAnomaly) - this.eccentricity);
        let distanceY = this.semiMajorAxis * (Math.sqrt(1 - (this.eccentricity * this.eccentricity)) * Math.sin(this.eccentricAnomaly));
        this.trueAnomaly = Math.atan2(distanceY, distanceX);
        let argumentPerihelion = this.longitudePerihelion - this.longitudeAscendNode;
        let r = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
        let x = r * (Math.cos(this.longitudeAscendNode) * Math.cos(argumentPerihelion + this.trueAnomaly) - Math.sin(this.longitudeAscendNode) * Math.sin(argumentPerihelion + this.trueAnomaly) * Math.cos(this.inclination));
        let y = r * (Math.sin(this.longitudeAscendNode) * Math.cos(argumentPerihelion + this.trueAnomaly) + Math.cos(this.longitudeAscendNode) * Math.sin(argumentPerihelion + this.trueAnomaly) * Math.cos(this.inclination));
        let z = r * (Math.sin(argumentPerihelion + this.trueAnomaly) * Math.sin(this.inclination));
        let planetCenter = [x, y, z];
        return planetCenter;
    }
};

/* The primary orbital elements are here denoted as:
    N = longitude of the ascending node
    i = inclination to the ecliptic (plane of the Earth's orbit)
    w = argument of perihelion
    a = semi-major axis, or mean distance from Sun
    e = eccentricity (0=circle, 0-1=ellipse, 1=parabola)
    M = mean anomaly (0 at perihelion; increases uniformly with time)
Related orbital elements are:
    w1 = N + w   = longitude of perihelion
    L  = M + w1  = mean longitude
    q  = a*(1-e) = perihelion distance
    Q  = a*(1+e) = aphelion distance
    P  = a ^ 1.5 = orbital period (years if a is in AU, astronomical units)
    T  = Epoch_of_M - (M(deg)/360_deg) / P  = time of perihelion
    v  = true anomaly (angle between position and perihelion)
    E  = eccentric anomaly */

    //148,076,049 kilometers, equivalent to 0.989827 AU vs. 0.989831

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
